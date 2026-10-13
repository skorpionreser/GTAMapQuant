using GTAMapQuant.BLL.DTO.MapModes;
using GTAMapQuant.BLL.MediatR.MapModes.CreateMapMode;
using GTAMapQuant.BLL.MediatR.MapModes.DeleteMapMode;
using GTAMapQuant.BLL.MediatR.MapModes.GetAllMapModes;
using GTAMapQuant.BLL.MediatR.MapModes.GetMapModeContent;
using GTAMapQuant.BLL.MediatR.MapModes.UpdateMapMode;
using GTAMapQuant.DAL.Entities;
using GTAMapQuant.XUnitTest.Helpers;
using Xunit;

namespace GTAMapQuant.XUnitTest.MediatRTests.MapModes;

public class MapModeHandlersTests
{
    [Fact]
    public async Task Create_WhenLinksExist_ShouldCreateModeReplaceDefaultAndSaveAssignments()
    {
        await using var database = await TestDatabase.CreateAsync();
        var oldDefault = CreateMapMode("Old default", isDefault: true);
        var area = new MapArea { Id = Guid.NewGuid(), Name = "Area", Color = "#ffffff" };
        var marker = CreateMarker("Marker", isStandard: false);
        database.Context.AddRange(oldDefault, area, marker);
        await database.Context.SaveChangesAsync();

        var handler = new CreateMapModeHandler(database.Context);
        var result = await handler.Handle(new CreateMapModeCommand(new CreateMapModeDto
        {
            Name = "  New default  ",
            Description = "New description",
            SortOrder = 3,
            IsDefault = true,
            ShowStandardMarkersByDefault = true,
            MapAreaIds = [area.Id],
            MapMarkerIds = [marker.Id],
        }), CancellationToken.None);

        Assert.True(result.IsSuccess);
        Assert.Equal("New default", result.Value.Name);
        Assert.True(result.Value.IsDefault);
        Assert.False(oldDefault.IsDefault);
        Assert.Single(database.Context.MapModeAreas.Where(link => link.MapModeId == result.Value.Id));
        Assert.Single(database.Context.MapModeMarkers.Where(link => link.MapModeId == result.Value.Id));
    }

    [Fact]
    public async Task Create_WhenAssignedAreaDoesNotExist_ShouldReturnFailure()
    {
        await using var database = await TestDatabase.CreateAsync();
        var handler = new CreateMapModeHandler(database.Context);

        var result = await handler.Handle(new CreateMapModeCommand(new CreateMapModeDto
        {
            Name = "Invalid mode",
            MapAreaIds = [Guid.NewGuid()],
        }), CancellationToken.None);

        Assert.True(result.IsFailed);
        Assert.Contains(result.Errors, error => error.Message == "One or more map areas do not exist.");
    }

    [Fact]
    public async Task Update_WhenModeIsEditable_ShouldReplaceAssignmentsAndMakeItDefault()
    {
        await using var database = await TestDatabase.CreateAsync();
        var oldDefault = CreateMapMode("Old default", isDefault: true);
        var mode = CreateMapMode("Editable mode");
        var oldArea = new MapArea { Id = Guid.NewGuid(), Name = "Old area", Color = "#ffffff" };
        var newArea = new MapArea { Id = Guid.NewGuid(), Name = "New area", Color = "#000000" };
        var oldMarker = CreateMarker("Old marker", isStandard: false);
        var newMarker = CreateMarker("New marker", isStandard: false);
        database.Context.AddRange(oldDefault, mode, oldArea, newArea, oldMarker, newMarker);
        database.Context.MapModeAreas.Add(new MapModeArea { MapModeId = mode.Id, MapAreaId = oldArea.Id });
        database.Context.MapModeMarkers.Add(new MapModeMarker { MapModeId = mode.Id, MapMarkerId = oldMarker.Id });
        await database.Context.SaveChangesAsync();

        var handler = new UpdateMapModeHandler(database.Context);
        var result = await handler.Handle(new UpdateMapModeCommand(mode.Id, new UpdateMapModeDto
        {
            Name = "Updated mode",
            Description = "Updated description",
            SortOrder = 5,
            IsDefault = true,
            ShowStandardMarkersByDefault = true,
            MapAreaIds = [newArea.Id],
            MapMarkerIds = [newMarker.Id],
        }), CancellationToken.None);

        Assert.True(result.IsSuccess);
        Assert.Equal("Updated mode", result.Value!.Name);
        Assert.False(oldDefault.IsDefault);
        Assert.Equal([newArea.Id], database.Context.MapModeAreas.Where(link => link.MapModeId == mode.Id).Select(link => link.MapAreaId));
        Assert.Equal([newMarker.Id], database.Context.MapModeMarkers.Where(link => link.MapModeId == mode.Id).Select(link => link.MapMarkerId));
    }

    [Fact]
    public async Task Update_WhenSystemMode_ShouldReturnFailureWithoutChangingIt()
    {
        await using var database = await TestDatabase.CreateAsync();
        var mode = CreateMapMode("System", isDefault: true);
        mode.IsSystem = true;
        database.Context.MapModes.Add(mode);
        await database.Context.SaveChangesAsync();

        var handler = new UpdateMapModeHandler(database.Context);
        var result = await handler.Handle(new UpdateMapModeCommand(mode.Id, new UpdateMapModeDto
        {
            Name = "Changed",
        }), CancellationToken.None);

        Assert.True(result.IsFailed);
        Assert.Equal("System", mode.Name);
    }

    [Fact]
    public async Task Delete_WhenModeHasAssignments_ShouldDeleteModeAndAssignments()
    {
        await using var database = await TestDatabase.CreateAsync();
        var defaultMode = CreateMapMode("Default", isDefault: true);
        var mode = CreateMapMode("Disposable");
        var area = new MapArea { Id = Guid.NewGuid(), Name = "Area", Color = "#ffffff" };
        var marker = CreateMarker("Marker", isStandard: false);
        database.Context.AddRange(defaultMode, mode, area, marker);
        database.Context.MapModeAreas.Add(new MapModeArea { MapModeId = mode.Id, MapAreaId = area.Id });
        database.Context.MapModeMarkers.Add(new MapModeMarker { MapModeId = mode.Id, MapMarkerId = marker.Id });
        await database.Context.SaveChangesAsync();

        var handler = new DeleteMapModeHandler(database.Context);
        var result = await handler.Handle(new DeleteMapModeCommand(mode.Id), CancellationToken.None);

        Assert.True(result.IsSuccess);
        Assert.Equal(mode.Id, result.Value!.Id);
        Assert.Null(await database.Context.MapModes.FindAsync(mode.Id));
        Assert.Empty(database.Context.MapModeAreas.Where(link => link.MapModeId == mode.Id));
        Assert.Empty(database.Context.MapModeMarkers.Where(link => link.MapModeId == mode.Id));
    }

    [Fact]
    public async Task Delete_WhenItIsTheOnlyDefault_ShouldReturnFailure()
    {
        await using var database = await TestDatabase.CreateAsync();
        var mode = CreateMapMode("Only default", isDefault: true);
        database.Context.MapModes.Add(mode);
        await database.Context.SaveChangesAsync();

        var handler = new DeleteMapModeHandler(database.Context);
        var result = await handler.Handle(new DeleteMapModeCommand(mode.Id), CancellationToken.None);

        Assert.True(result.IsFailed);
        Assert.NotNull(await database.Context.MapModes.FindAsync(mode.Id));
    }

    [Fact]
    public async Task GetAll_WhenModesExist_ShouldReturnDefaultModeFirstAndThenBySortOrder()
    {
        await using var database = await TestDatabase.CreateAsync();
        database.Context.MapModes.AddRange(
            CreateMapMode("Later", sortOrder: 20),
            CreateMapMode("Default", sortOrder: 100, isDefault: true),
            CreateMapMode("Earlier", sortOrder: 10));
        await database.Context.SaveChangesAsync();

        var handler = new GetAllMapModesHandler(database.Context);

        var result = await handler.Handle(new GetAllMapModesQuery(), CancellationToken.None);

        Assert.True(result.IsSuccess);
        Assert.Collection(
            result.Value,
            mode => Assert.Equal("Default", mode.Name),
            mode => Assert.Equal("Earlier", mode.Name),
            mode => Assert.Equal("Later", mode.Name));
    }

    [Fact]
    public async Task GetContent_WhenModeDoesNotExist_ShouldReturnNull()
    {
        await using var database = await TestDatabase.CreateAsync();
        var handler = new GetMapModeContentHandler(database.Context);

        var result = await handler.Handle(
            new GetMapModeContentQuery(Guid.NewGuid(), null),
            CancellationToken.None);

        Assert.True(result.IsSuccess);
        Assert.Null(result.Value);
    }

    [Fact]
    public async Task GetContent_WhenModeUsesDefaultWithoutStandardMarkers_ShouldReturnLinkedContentOnly()
    {
        await using var database = await TestDatabase.CreateAsync();
        var mode = CreateMapMode("Game zones", showStandardMarkersByDefault: false);
        var areaId = Guid.NewGuid();
        var area = new MapArea
        {
            Id = areaId,
            Name = "Included area",
            Color = "#22c55e",
            Points = new List<MapAreaPoint>
            {
                new() { Id = Guid.NewGuid(), MapAreaId = areaId, X = 30, Y = 30, Order = 2 },
                new() { Id = Guid.NewGuid(), MapAreaId = areaId, X = 10, Y = 10, Order = 0 },
                new() { Id = Guid.NewGuid(), MapAreaId = areaId, X = 20, Y = 10, Order = 1 },
            },
        };
        var specialMarker = CreateMarker("Special marker", isStandard: false);
        var standardMarker = CreateMarker("Standard marker", isStandard: true);

        database.Context.AddRange(mode, area, specialMarker, standardMarker);
        database.Context.MapModeAreas.Add(new MapModeArea
        {
            MapModeId = mode.Id,
            MapAreaId = area.Id,
        });
        database.Context.MapModeMarkers.Add(new MapModeMarker
        {
            MapModeId = mode.Id,
            MapMarkerId = specialMarker.Id,
        });
        await database.Context.SaveChangesAsync();

        var handler = new GetMapModeContentHandler(database.Context);

        var result = await handler.Handle(
            new GetMapModeContentQuery(mode.Id, null),
            CancellationToken.None);

        Assert.True(result.IsSuccess);
        var content = Assert.IsType<MapModeContentDto>(result.Value);
        Assert.False(content.ShowStandardMarkers);
        var returnedArea = Assert.Single(content.Areas);
        Assert.Equal(area.Id, returnedArea.Id);
        Assert.Equal(new[] { 0, 1, 2 }, returnedArea.Points.Select(point => point.Order));
        var returnedMarker = Assert.Single(content.Markers);
        Assert.Equal(specialMarker.Id, returnedMarker.Id);
    }

    [Fact]
    public async Task GetContent_WhenStandardMarkersAreRequested_ShouldIncludeThemWithoutDuplicates()
    {
        await using var database = await TestDatabase.CreateAsync();
        var mode = CreateMapMode("World map", showStandardMarkersByDefault: false);
        var linkedStandardMarker = CreateMarker("Linked standard", isStandard: true);
        var unlinkedStandardMarker = CreateMarker("Unlinked standard", isStandard: true);
        var linkedSpecialMarker = CreateMarker("Linked special", isStandard: false);
        var unlinkedSpecialMarker = CreateMarker("Unlinked special", isStandard: false);

        database.Context.AddRange(
            mode,
            linkedStandardMarker,
            unlinkedStandardMarker,
            linkedSpecialMarker,
            unlinkedSpecialMarker);
        database.Context.MapModeMarkers.AddRange(
            new MapModeMarker { MapModeId = mode.Id, MapMarkerId = linkedStandardMarker.Id },
            new MapModeMarker { MapModeId = mode.Id, MapMarkerId = linkedSpecialMarker.Id });
        await database.Context.SaveChangesAsync();

        var handler = new GetMapModeContentHandler(database.Context);

        var result = await handler.Handle(
            new GetMapModeContentQuery(mode.Id, true),
            CancellationToken.None);

        Assert.True(result.IsSuccess);
        var content = Assert.IsType<MapModeContentDto>(result.Value);
        Assert.True(content.ShowStandardMarkers);
        Assert.Equal(3, content.Markers.Count());
        Assert.Contains(content.Markers, marker => marker.Id == linkedStandardMarker.Id);
        Assert.Contains(content.Markers, marker => marker.Id == unlinkedStandardMarker.Id);
        Assert.Contains(content.Markers, marker => marker.Id == linkedSpecialMarker.Id);
        Assert.DoesNotContain(content.Markers, marker => marker.Id == unlinkedSpecialMarker.Id);
    }

    [Fact]
    public async Task GetContent_WhenStandardMarkersAreDisabledExplicitly_ShouldExcludeThem()
    {
        await using var database = await TestDatabase.CreateAsync();
        var mode = CreateMapMode("World map", showStandardMarkersByDefault: true);
        var standardMarker = CreateMarker("Standard marker", isStandard: true);
        var specialMarker = CreateMarker("Special marker", isStandard: false);

        database.Context.AddRange(mode, standardMarker, specialMarker);
        database.Context.MapModeMarkers.Add(new MapModeMarker
        {
            MapModeId = mode.Id,
            MapMarkerId = specialMarker.Id,
        });
        await database.Context.SaveChangesAsync();

        var handler = new GetMapModeContentHandler(database.Context);

        var result = await handler.Handle(
            new GetMapModeContentQuery(mode.Id, false),
            CancellationToken.None);

        Assert.True(result.IsSuccess);
        var content = Assert.IsType<MapModeContentDto>(result.Value);
        Assert.False(content.ShowStandardMarkers);
        var returnedMarker = Assert.Single(content.Markers);
        Assert.Equal(specialMarker.Id, returnedMarker.Id);
    }

    private static MapMode CreateMapMode(
        string name,
        int sortOrder = 0,
        bool isDefault = false,
        bool showStandardMarkersByDefault = false)
    {
        return new MapMode
        {
            Id = Guid.NewGuid(),
            Name = name,
            SortOrder = sortOrder,
            IsDefault = isDefault,
            ShowStandardMarkersByDefault = showStandardMarkersByDefault,
        };
    }

    private static MapMarker CreateMarker(string name, bool isStandard)
    {
        return new MapMarker
        {
            Id = Guid.NewGuid(),
            Name = name,
            Category = MarkerCategory.Other,
            IsStandard = isStandard,
            X = 10,
            Y = 20,
        };
    }
}
