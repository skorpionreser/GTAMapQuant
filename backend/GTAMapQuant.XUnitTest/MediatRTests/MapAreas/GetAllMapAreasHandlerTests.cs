using GTAMapQuant.BLL.MediatR.MapAreas.GetAllMapAreas;
using GTAMapQuant.DAL.Entities;
using GTAMapQuant.XUnitTest.Helpers;
using Xunit;

namespace GTAMapQuant.XUnitTest.MediatRTests.MapAreas;

public class GetAllMapAreasHandlerTests
{
    [Fact]
    public async Task Handle_WhenAreasExist_ShouldReturnTheirPointsOrderedByOrder()
    {
        await using var database = await TestDatabase.CreateAsync();
        var areaId = Guid.NewGuid();
        database.Context.MapAreas.Add(new MapArea
        {
            Id = areaId,
            Name = "Los Santos",
            Color = "#f97316",
            Points = new List<MapAreaPoint>
            {
                new() { Id = Guid.NewGuid(), MapAreaId = areaId, X = 30, Y = 30, Order = 2 },
                new() { Id = Guid.NewGuid(), MapAreaId = areaId, X = 10, Y = 10, Order = 0 },
                new() { Id = Guid.NewGuid(), MapAreaId = areaId, X = 20, Y = 10, Order = 1 },
            },
        });
        await database.Context.SaveChangesAsync();

        var handler = new GetAllMapAreasHandler(database.Context);

        var result = await handler.Handle(new GetAllMapAreasQuery(), CancellationToken.None);

        Assert.True(result.IsSuccess);
        var area = Assert.Single(result.Value);
        Assert.Equal("Los Santos", area.Name);
        Assert.Equal(new[] { 0, 1, 2 }, area.Points.Select(point => point.Order));
    }

    [Fact]
    public async Task Handle_WhenAreasDoNotExist_ShouldReturnEmptyCollection()
    {
        await using var database = await TestDatabase.CreateAsync();
        var handler = new GetAllMapAreasHandler(database.Context);

        var result = await handler.Handle(new GetAllMapAreasQuery(), CancellationToken.None);

        Assert.True(result.IsSuccess);
        Assert.Empty(result.Value);
    }
}
