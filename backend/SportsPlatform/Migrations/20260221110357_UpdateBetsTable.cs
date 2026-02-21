using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SportsPlatform.Migrations
{
    /// <inheritdoc />
    public partial class UpdateBetsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bets_Competitions_CompetitionId",
                table: "Bets");

            migrationBuilder.RenameColumn(
                name: "CompetitionId",
                table: "Bets",
                newName: "MatchId");

            migrationBuilder.RenameIndex(
                name: "IX_Bets_CompetitionId",
                table: "Bets",
                newName: "IX_Bets_MatchId");

            migrationBuilder.AddColumn<string>(
                name: "Choice",
                table: "Bets",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_Bets_Matches_MatchId",
                table: "Bets",
                column: "MatchId",
                principalTable: "Matches",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bets_Matches_MatchId",
                table: "Bets");

            migrationBuilder.DropColumn(
                name: "Choice",
                table: "Bets");

            migrationBuilder.RenameColumn(
                name: "MatchId",
                table: "Bets",
                newName: "CompetitionId");

            migrationBuilder.RenameIndex(
                name: "IX_Bets_MatchId",
                table: "Bets",
                newName: "IX_Bets_CompetitionId");

            migrationBuilder.AddForeignKey(
                name: "FK_Bets_Competitions_CompetitionId",
                table: "Bets",
                column: "CompetitionId",
                principalTable: "Competitions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
