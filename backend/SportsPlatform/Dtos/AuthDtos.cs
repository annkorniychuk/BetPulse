namespace SportsPlatform.Dtos;

public record RegisterDto(string Email, string Password, string Name);
public record LoginDto(string Email, string Password);
public record UpdateProfileDto(string Name, string Email);
public record ChangePasswordDto(string OldPassword, string NewPassword);