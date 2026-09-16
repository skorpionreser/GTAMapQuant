using GTAMapQuant.BLL.DTO.MapAreas;
using GTAMapQuant.BLL.MediatR.MapAreas.CreateMapArea;
using GTAMapQuant.XUnitTest.Helpers;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace GTAMapQuant.XUnitTest.MediatRTests.MapAreas;

public class CreateMapAreaHandlerTests
{
    [Fact]
    public async Task Handle_WhenAreaIsValid_ShouldSaveAreaAndReturnOrderedPoints()
    {
        await using var database = await TestDatabase.CreateAsync();
        var handler = new CreateMapAreaHandler(database.Context);
        var area = new CreateMapAreaDto
        {
            Name = "Sandy Shores",
            Description = "Test area.",
            Color = "#2563eb",
            Points = new[]
            {
                new CreateMapAreaPointDto { X = 30, Y = 30, Order = 2 },
                new CreateMapAreaPointDto { X = 10, Y = 10, Order = 0 },
                new CreateMapAreaPointDto { X = 20, Y = 10, Order = 1 },
            },
        };

        var result = await handler.Handle(
            new CreateMapAreaCommand(area),
            CancellationToken.None);

        Assert.True(result.IsSuccess);
        Assert.Equal("Sandy Shores", result.Value.Name);
        Assert.Equal(new[] { 0, 1, 2 }, result.Value.Points.Select(point => point.Order));

        var savedArea = await database.Context.MapAreas
            .Include(mapArea => mapArea.Points)
            .SingleAsync();

        Assert.Equal(result.Value.Id, savedArea.Id);
        Assert.Equal(3, savedArea.Points.Count);
        Assert.All(savedArea.Points, point => Assert.Equal(savedArea.Id, point.MapAreaId));
    }
}
