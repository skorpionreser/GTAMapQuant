using GTAMapQuant.DAL.Entities;

namespace GTAMapQuant.Api.Auth;

public interface ITokenService
{
    string CreateToken(AdminUser user);
}
