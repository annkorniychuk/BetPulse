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

    public async Task<Bet> PlaceBetAsync(int userId, int matchId, string choice, decimal amount, decimal odd)
    {
        // 1. Шукаємо користувача
        var user = await _context.Users.FindAsync(userId);
        if (user == null) throw new Exception("Користувача не знайдено");

        // 2. ПЕРЕВІРЯЄМО БАЛАНС
        if (user.Balance < amount) throw new Exception("Недостатньо коштів на балансі");

        var match = await _context.Matches.FindAsync(matchId);
        if (match == null) throw new Exception("Матч не знайдено");

        // 3. ЗНІМАЄМО ГРОШІ
        user.Balance -= amount;

        var bet = new Bet
        {
            UserId = userId,
            MatchId = matchId,
            Choice = choice,
            Amount = amount,
            Odd = odd,
            Status = "Pending",
            PotentialWin = amount * odd,
            BetDate = DateTime.UtcNow
        };

        _context.Bets.Add(bet);

        // SaveChangesAsync збереже і нову ставку, і новий баланс юзера одночасно!
        await _context.SaveChangesAsync();

        return bet;
    }
}