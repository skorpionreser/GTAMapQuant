using System;

namespace GTAMapQuant.Api.Auth;

public sealed record LoginResponse(
    string Token,
    string Login,
    string Role);
