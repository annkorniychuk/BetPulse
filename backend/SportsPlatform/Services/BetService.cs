using Microsoft.EntityFrameworkCore;
using SportsPlatform.Data;
using SportsPlatform.Domain.Entities;

namespace SportsPlatform.Services;

public class BetService
{
    private readonly AppDbContext _context;

    public BetService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Bet> PlaceBetAsync(int userId, int competitionId, decimal amount, decimal odd)
    {
        var competition = await _context.Competitions.FindAsync(competitionId);
        if (competition == null) throw new Exception("Змагання не знайдено");

        var bet = new Bet
        {
            UserId = userId,
            CompetitionId = competitionId,
            Amount = amount,
            Odd = odd, // Коефіцієнт
            Status = "Pending", // Статус: В очікуванні
            PotentialWin = amount * odd,
            BetDate = DateTime.UtcNow
        };

        _context.Bets.Add(bet);
        await _context.SaveChangesAsync();

        return bet;
    }
}