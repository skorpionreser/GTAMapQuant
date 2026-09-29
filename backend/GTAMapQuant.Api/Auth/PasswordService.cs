using GTAMapQuant.DAL.Entities;
using Microsoft.AspNetCore.Identity;

namespace GTAMapQuant.Api.Auth;

public sealed class PasswordService : IPasswordService
{
    private readonly IPasswordHasher<AdminUser> _passwordHasher;

    public PasswordService(IPasswordHasher<AdminUser> passwordHasher)
    {
        _passwordHasher = passwordHasher;
    }

    public string HashPassword(AdminUser user, string password)
    {
        return _passwordHasher.HashPassword(user, password);
    }

    public bool VerifyPassword(AdminUser user, string password)
    {
        var verificationResult = _passwordHasher.VerifyHashedPassword(
            user,
            user.PasswordHash,
            password);

        return verificationResult != PasswordVerificationResult.Failed;
    }
}
