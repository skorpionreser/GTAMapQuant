using FluentValidation;
using GTAMapQuant.Api.Auth;
using GTAMapQuant.Api.ExceptionHandlers;
using GTAMapQuant.BLL.MediatR.Behaviors;
using GTAMapQuant.DAL.Data;
using GTAMapQuant.DAL.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;

namespace GTAMapQuant.Api;

public class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddCors(options =>
        {
            options.AddPolicy("Frontend", policy =>
            {
                policy.WithOrigins("http://localhost:5173")
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
        });

        builder.Services.Configure<JwtOptions>(
            builder.Configuration.GetSection(JwtOptions.SectionName));

        builder.Services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer();

        builder.Services
            .AddOptions<JwtBearerOptions>(JwtBearerDefaults.AuthenticationScheme)
            .Configure<IOptions<JwtOptions>>((options, jwtOptions) =>
            {
                var configuredJwtOptions = jwtOptions.Value;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = configuredJwtOptions.Issuer,

                    ValidateAudience = true,
                    ValidAudience = configuredJwtOptions.Audience,

                    ValidateLifetime = true,

                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Convert.FromBase64String(configuredJwtOptions.Key)),

                    ClockSkew = TimeSpan.Zero,
                };
            });

        builder.Services.AddAuthorization();

        var currentAssemblies = AppDomain.CurrentDomain.GetAssemblies();
        var bllAssembly = typeof(ValidationBehavior<,>).Assembly;

        builder.Services.AddValidatorsFromAssembly(bllAssembly);
        builder.Services.AddMediatR(config =>
        {
            config.RegisterServicesFromAssemblies(currentAssemblies);
            config.AddOpenBehavior(typeof(ValidationBehavior<,>));
        });

        builder.Services.AddDbContext<GtaMapDbContext>(options =>
            options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

        builder.Services.AddScoped<IPasswordHasher<AdminUser>, PasswordHasher<AdminUser>>();
        builder.Services.AddScoped<IPasswordService, PasswordService>();
        builder.Services.AddScoped<ITokenService, TokenService>();
        builder.Services.AddScoped<AdminBootstrapper>();
        builder.Services.AddProblemDetails();
        builder.Services.AddExceptionHandler<ValidationExceptionHandler>();
        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen(options =>
        {
            options.InferSecuritySchemes();
            options.AddSecurityRequirement(document => new OpenApiSecurityRequirement
            {
                [new OpenApiSecuritySchemeReference("Bearer", document)] = [],
            });
        });

        var app = builder.Build();

        await using (var scope = app.Services.CreateAsyncScope())
        {
            var bootstrapper = scope.ServiceProvider
                .GetRequiredService<AdminBootstrapper>();

            await bootstrapper.EnsureAdminExistsAsync(CancellationToken.None);
        }

        app.UseExceptionHandler();
        app.UseCors("Frontend");

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();
        app.UseAuthentication();
        app.UseAuthorization();
        app.MapControllers();

        await app.RunAsync();
    }
}
