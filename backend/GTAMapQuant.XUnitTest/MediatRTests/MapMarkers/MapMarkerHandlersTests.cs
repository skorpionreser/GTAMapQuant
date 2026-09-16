using GTAMapQuant.BLL.DTO.MapMarkers;
using GTAMapQuant.BLL.MediatR.MapMarkers.CreateMapMarker;
using GTAMapQuant.BLL.MediatR.MapMarkers.DeleteMapMarker;
using GTAMapQuant.BLL.MediatR.MapMarkers.GetAllMapMarkers;
using GTAMapQuant.BLL.MediatR.MapMarkers.GetMapMarkerById;
using GTAMapQuant.BLL.MediatR.MapMarkers.UpdateMapMarker;
using GTAMapQuant.DAL.Entities;
using GTAMapQuant.XUnitTest.Helpers;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace GTAMapQuant.XUnitTest.MediatRTests.MapMarkers;

public class MapMarkerHandlersTests
{
    [Fact]
    public async Task Create_WhenMarkerIsValid_ShouldSaveAndReturnMarker()
    {
        await using var database = await TestDatabase.CreateAsync();
        var handler = new CreateMapMarkerHandler(database.Context);

        var result = await handler.Handle(
            new CreateMapMarkerCommand(CreateMarkerDto("Ammu-Nation")),
            CancellationToken.None);

        Assert.True(result.IsSuccess);
        Assert.Equal("Ammu-Nation", result.Value.Name);
        Assert.Equal(1, await database.Context.MapMarkers.CountAsync());
    }

    [Fact]
    public async Task GetAll_WhenMarkersExist_ShouldReturnAllMarkers()
    {
        await using var database = await TestDatabase.CreateAsync();
        database.Context.MapMarkers.AddRange(
            CreateEntity("Shop", MarkerCategory.Shop),
            CreateEntity("Quest", MarkerCategory.Quest));
        await database.Context.SaveChangesAsync();

        var handler = new GetAllMapMarkersHandler(database.Context);

        var result = await handler.Handle(new GetAllMapMarkersQuery(), CancellationToken.None);

        Assert.True(result.IsSuccess);
        Assert.Equal(2, result.Value.Count());
    }

    [Fact]
    public async Task GetById_WhenMarkerDoesNotExist_ShouldReturnNull()
    {
        await using var database = await TestDatabase.CreateAsync();
        var handler = new GetMapMarkerByIdHandler(database.Context);

        var result = await handler.Handle(new GetMapMarkerByIdQuery(Guid.NewGuid()), CancellationToken.None);

        Assert.True(result.IsSuccess);
        Assert.Null(result.Value);
    }

    [Fact]
    public async Task Update_WhenMarkerExists_ShouldPersistNewValues()
    {
        await using var database = await TestDatabase.CreateAsync();
        var marker = CreateEntity("Old name", MarkerCategory.Other);
        database.Context.MapMarkers.Add(marker);
        await database.Context.SaveChangesAsync();
        var handler = new UpdateMapMarkerHandler(database.Context);
        var update = new UpdateMapMarkerDto
        {
            Name = "New name",
            Description = "Updated.",
            Category = MarkerCategory.ServiceStation,
            X = 100,
            Y = 200,
        };

        var result = await handler.Handle(
            new UpdateMapMarkerCommand(marker.Id, update),
            CancellationToken.None);

        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Value);
        Assert.Equal("New name", result.Value.Name);
        var savedMarker = await database.Context.MapMarkers.SingleAsync();
        Assert.Equal(MarkerCategory.ServiceStation, savedMarker.Category);
        Assert.Equal(100, savedMarker.X);
    }

    [Fact]
    public async Task Delete_WhenMarkerExists_ShouldReturnAndRemoveMarker()
    {
        await using var database = await TestDatabase.CreateAsync();
        var marker = CreateEntity("To delete", MarkerCategory.Quest);
        database.Context.MapMarkers.Add(marker);
        await database.Context.SaveChangesAsync();
        var handler = new DeleteMapMarkerHandler(database.Context);

        var result = await handler.Handle(new DeleteMapMarkerCommand(marker.Id), CancellationToken.None);

        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Value);
        Assert.Equal(marker.Id, result.Value.Id);
        Assert.Empty(database.Context.MapMarkers);
    }

    [Fact]
    public async Task Delete_WhenMarkerDoesNotExist_ShouldReturnNull()
    {
        await using var database = await TestDatabase.CreateAsync();
        var handler = new DeleteMapMarkerHandler(database.Context);

        var result = await handler.Handle(new DeleteMapMarkerCommand(Guid.NewGuid()), CancellationToken.None);

        Assert.True(result.IsSuccess);
        Assert.Null(result.Value);
    }

    private static CreateMapMarkerDto CreateMarkerDto(string name)
    {
        return new CreateMapMarkerDto
        {
            Name = name,
            Description = "Test marker.",
            Category = MarkerCategory.Shop,
            X = 10,
            Y = 20,
        };
    }

    private static MapMarker CreateEntity(string name, MarkerCategory category)
    {
        return new MapMarker
        {
            Id = Guid.NewGuid(),
            Name = name,
            Category = category,
            X = 10,
            Y = 20,
        };
    }
}
