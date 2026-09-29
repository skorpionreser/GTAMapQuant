using GTAMapQuant.DAL.Entities;

namespace GTAMapQuant.Api.Auth;

public interface IPasswordService
{
    string HashPassword(AdminUser user, string password);
    bool VerifyPassword(AdminUser user, string password);
}
