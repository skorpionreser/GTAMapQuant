using GTAMapQuant.DAL.Data;
using GTAMapQuant.DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace GTAMapQuant.Api.Auth;

public sealed class AdminBootstrapper
{
    private readonly GtaMapDbContext _gtaMapDbContext;
    private readonly IPasswordService _passwordService;
    private readonly IConfiguration _configuration;

    public AdminBootstrapper(
        GtaMapDbContext gtaMapDbContext,
        IPasswordService passwordService,
        IConfiguration configuration)
    {
        _gtaMapDbContext = gtaMapDbContext;
        _passwordService = passwordService;
        _configuration = configuration;
    }

    public async Task EnsureAdminExistsAsync(CancellationToken cancellationToken)
    {
        var login = _configuration["BootstrapAdmin:Login"];
        var password = _configuration["BootstrapAdmin:Password"];

        if (string.IsNullOrWhiteSpace(login) ||
            string.IsNullOrWhiteSpace(password))
        {
            return;
        }

        var normalizedLogin = login.Trim();

        var existingAdmin = await _gtaMapDbContext.AdminUsers
            .AsNoTracking()
            .SingleOrDefaultAsync(
                user => user.Login == normalizedLogin,
                cancellationToken);
        
        if (existingAdmin is not null)
        {
            return;
        }

        var admin = new AdminUser
        {
            Id = Guid.NewGuid(),
            Login = normalizedLogin,
            Role = "Admin",
        };

        admin.PasswordHash = _passwordService.HashPassword(admin, password);

        _gtaMapDbContext.AdminUsers.Add(admin);
        await _gtaMapDbContext.SaveChangesAsync(cancellationToken);
    }
}
