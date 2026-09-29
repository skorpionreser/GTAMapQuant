using System.ComponentModel.DataAnnotations;

namespace GTAMapQuant.Api.Auth;

public class LoginRequest
{
    [Required]
    [MaxLength(50)]
    public string Login { get; set; } = string.Empty;
    [Required]
    public string Password { get; set; } = string.Empty;
}
