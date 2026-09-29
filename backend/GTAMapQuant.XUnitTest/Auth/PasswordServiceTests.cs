using GTAMapQuant.Api.Auth;
using GTAMapQuant.DAL.Entities;
using Microsoft.AspNetCore.Identity;
using Xunit;

namespace GTAMapQuant.XUnitTest.Auth;

public class PasswordServiceTests
{
    [Fact]
    public void VerifyPassword_WhenPasswordMatchesHash_ShouldReturnTrue()
    {
        const string password = "CorrectPassword123!";
        var user = new AdminUser();
        var passwordService = new PasswordService(new PasswordHasher<AdminUser>());

        user.PasswordHash = passwordService.HashPassword(user, password);

        Assert.NotEqual(password, user.PasswordHash);
        Assert.True(passwordService.VerifyPassword(user, password));
        Assert.False(passwordService.VerifyPassword(user, "WrongPassword123!"));
    }
}
