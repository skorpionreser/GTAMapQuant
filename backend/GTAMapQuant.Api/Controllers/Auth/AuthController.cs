using GTAMapQuant.Api.Auth;
using GTAMapQuant.DAL.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GTAMapQuant.Api.Controllers.Auth;

[ApiController]
[Route("api/[controller]")]
public sealed class AuthController : ControllerBase
{
    private readonly GtaMapDbContext _gtaMapDbContext;
    private readonly IPasswordService _passwordService;
    private readonly ITokenService _tokenService;

    public AuthController(
        GtaMapDbContext gtaMapDbContext,
        IPasswordService passwordService,
        ITokenService tokenService)
    {
        _gtaMapDbContext = gtaMapDbContext;
        _passwordService = passwordService;
        _tokenService = tokenService;
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login(
        LoginRequest request,
        CancellationToken cancellationToken)
    {
        var admin = await _gtaMapDbContext.AdminUsers
            .AsNoTracking()
            .SingleOrDefaultAsync(
                user => user.Login == request.Login,
                cancellationToken
            );
        
        if (admin is null || !_passwordService.VerifyPassword(admin, request.Password))
        {
            return Unauthorized();
        }

        var token = _tokenService.CreateToken(admin);

        return Ok(new LoginResponse(token, admin.Login, admin.Role));
    }
}
