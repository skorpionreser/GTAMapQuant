using System.Net.Http.Headers;
using System.Net.Http.Json;
using GTAMapQuant.Api;
using GTAMapQuant.Api.Auth;
using GTAMapQuant.DAL.Data;
using GTAMapQuant.DAL.Entities;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace GTAMapQuant.IntegrationTest;

public sealed class GtaMapWebApplicationFactory : WebApplicationFactory<Program>
{
    private const string TestAdminLogin = "test-admin";
    private const string TestAdminPassword = "TestPassword123!";

    private readonly string _databasePath = Path.Combine(
        Path.GetTempPath(),
        $"gtamapquant-tests-{Guid.NewGuid()}.db");

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Development");
        builder.ConfigureAppConfiguration((_, configuration) =>
        {
            configuration.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Issuer"] = "GTAMapQuant.IntegrationTests",
                ["Jwt:Audience"] = "GTAMapQuant.IntegrationTests",
                ["Jwt:ExpiresInMinutes"] = "60",
                ["Jwt:Key"] = "MDEyMzQ1Njc4OWFiY2RlZjAxMjM0NTY3ODlhYmNkZWY=",
                ["BootstrapAdmin:Login"] = string.Empty,
                ["BootstrapAdmin:Password"] = string.Empty,
            });
        });
        builder.ConfigureServices(services =>
        {
            services.RemoveAll<DbContextOptions<GtaMapDbContext>>();
            services.AddDbContext<GtaMapDbContext>(options =>
                options.UseSqlite($"Data Source={_databasePath}"));
        });
    }

    public async Task ResetDatabaseAsync()
    {
        using var scope = Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<GtaMapDbContext>();
        await context.Database.EnsureDeletedAsync();
        await context.Database.EnsureCreatedAsync();
    }

    public async Task<HttpClient> CreateAdminClientAsync()
    {
        using (var scope = Services.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<GtaMapDbContext>();
            var passwordService = scope.ServiceProvider.GetRequiredService<IPasswordService>();
            var admin = new AdminUser
            {
                Id = Guid.NewGuid(),
                Login = TestAdminLogin,
                Role = "Admin",
            };

            admin.PasswordHash = passwordService.HashPassword(admin, TestAdminPassword);
            context.AdminUsers.Add(admin);
            await context.SaveChangesAsync();
        }

        var client = CreateClient();
        var loginResponse = await client.PostAsJsonAsync(
            "/api/Auth/login",
            new LoginRequest
            {
                Login = TestAdminLogin,
                Password = TestAdminPassword,
            });

        loginResponse.EnsureSuccessStatusCode();
        var login = await loginResponse.Content.ReadFromJsonAsync<LoginResponse>();
        ArgumentNullException.ThrowIfNull(login);

        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            login.Token);

        return client;
    }

    protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);

        if (disposing && File.Exists(_databasePath))
        {
            SqliteConnection.ClearAllPools();
            File.Delete(_databasePath);
        }
    }
}
