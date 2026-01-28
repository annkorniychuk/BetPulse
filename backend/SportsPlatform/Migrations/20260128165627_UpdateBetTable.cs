using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SportsPlatform.Migrations
{
    /// <inheritdoc />
    public partial class UpdateBetTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EventName",
                table: "Bets");

            migrationBuilder.RenameColumn(
                name: "DatePlaced",
                table: "Bets",
                newName: "BetDate");

            migrationBuilder.RenameColumn(
                name: "Coefficient",
                table: "Bets",
                newName: "PotentialWin");

            migrationBuilder.AddColumn<int>(
                name: "CompetitionId",
                table: "Bets",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "Odd",
                table: "Bets",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.CreateIndex(
                name: "IX_Bets_CompetitionId",
                table: "Bets",
                column: "CompetitionId");

            migrationBuilder.AddForeignKey(
                name: "FK_Bets_Competitions_CompetitionId",
                table: "Bets",
                column: "CompetitionId",
                principalTable: "Competitions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bets_Competitions_CompetitionId",
                table: "Bets");

            migrationBuilder.DropIndex(
                name: "IX_Bets_CompetitionId",
                table: "Bets");

            migrationBuilder.DropColumn(
                name: "CompetitionId",
                table: "Bets");

            migrationBuilder.DropColumn(
                name: "Odd",
                table: "Bets");

            migrationBuilder.RenameColumn(
                name: "PotentialWin",
                table: "Bets",
                newName: "Coefficient");

            migrationBuilder.RenameColumn(
                name: "BetDate",
                table: "Bets",
                newName: "DatePlaced");

            migrationBuilder.AddColumn<string>(
                name: "EventName",
                table: "Bets",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
