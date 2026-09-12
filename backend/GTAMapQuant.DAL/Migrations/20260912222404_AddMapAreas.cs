using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GTAMapQuant.DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddMapAreas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MapAreas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    Color = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MapAreas", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MapAreaPoints",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    MapAreaId = table.Column<Guid>(type: "TEXT", nullable: false),
                    X = table.Column<double>(type: "REAL", nullable: false),
                    Y = table.Column<double>(type: "REAL", nullable: false),
                    Order = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MapAreaPoints", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MapAreaPoints_MapAreas_MapAreaId",
                        column: x => x.MapAreaId,
                        principalTable: "MapAreas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MapAreaPoints_MapAreaId",
                table: "MapAreaPoints",
                column: "MapAreaId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MapAreaPoints");

            migrationBuilder.DropTable(
                name: "MapAreas");
        }
    }
}
