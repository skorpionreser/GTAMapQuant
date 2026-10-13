using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GTAMapQuant.DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddMapModes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsStandard",
                table: "MapMarkers",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "MapModes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    SortOrder = table.Column<int>(type: "INTEGER", nullable: false),
                    IsDefault = table.Column<bool>(type: "INTEGER", nullable: false),
                    IsSystem = table.Column<bool>(type: "INTEGER", nullable: false),
                    ShowStandardMarkersByDefault = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MapModes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MapModeAreas",
                columns: table => new
                {
                    MapModeId = table.Column<Guid>(type: "TEXT", nullable: false),
                    MapAreaId = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MapModeAreas", x => new { x.MapModeId, x.MapAreaId });
                    table.ForeignKey(
                        name: "FK_MapModeAreas_MapAreas_MapAreaId",
                        column: x => x.MapAreaId,
                        principalTable: "MapAreas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MapModeAreas_MapModes_MapModeId",
                        column: x => x.MapModeId,
                        principalTable: "MapModes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MapModeMarkers",
                columns: table => new
                {
                    MapModeId = table.Column<Guid>(type: "TEXT", nullable: false),
                    MapMarkerId = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MapModeMarkers", x => new { x.MapModeId, x.MapMarkerId });
                    table.ForeignKey(
                        name: "FK_MapModeMarkers_MapMarkers_MapMarkerId",
                        column: x => x.MapMarkerId,
                        principalTable: "MapMarkers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MapModeMarkers_MapModes_MapModeId",
                        column: x => x.MapModeId,
                        principalTable: "MapModes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MapModeAreas_MapAreaId",
                table: "MapModeAreas",
                column: "MapAreaId");

            migrationBuilder.CreateIndex(
                name: "IX_MapModeMarkers_MapMarkerId",
                table: "MapModeMarkers",
                column: "MapMarkerId");

            migrationBuilder.InsertData(
            table: "MapModes",
            columns: new[]
            {
                "Id",
                "Name",
                "Description",
                "SortOrder",
                "IsDefault",
                "IsSystem",
                "ShowStandardMarkersByDefault",
            },
            values: new object[,]
            {
                {
                    Guid.Parse("69bfbcb4-5366-4651-a5b3-047917651bf9"),
                    "Карта мира",
                    "Основная карта со стандартными метками.",
                    0,
                    true,
                    true,
                    true,
                },
                {
                    Guid.Parse("fe5e1a91-7ea1-43f7-a005-1105e2764459"),
                    "Игровые зоны",
                    "Территории и игровые активности.",
                    1,
                    false,
                    true,
                    false,
                },
            });

            migrationBuilder.Sql("""
                UPDATE "MapMarkers"
                SET "IsStandard" = 1;
                """);

            migrationBuilder.Sql("""
                INSERT INTO "MapModeAreas" ("MapModeId", "MapAreaId")
                SELECT 'FE5E1A91-7EA1-43F7-A005-1105E2764459', "Id"
                FROM "MapAreas";
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MapModeAreas");

            migrationBuilder.DropTable(
                name: "MapModeMarkers");

            migrationBuilder.DropTable(
                name: "MapModes");

            migrationBuilder.DropColumn(
                name: "IsStandard",
                table: "MapMarkers");
        }
    }
}
