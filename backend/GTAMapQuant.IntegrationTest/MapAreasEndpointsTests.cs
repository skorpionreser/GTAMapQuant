using System.Net;
using System.Net.Http.Json;
using GTAMapQuant.BLL.DTO.MapAreas;
using Xunit;

namespace GTAMapQuant.IntegrationTest;

[Collection(ApiIntegrationTestCollection.Name)]
public class MapAreasEndpointsTests
{
    private readonly GtaMapWebApplicationFactory _factory;

    public MapAreasEndpointsTests(GtaMapWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task CreateThenGetAll_WhenAreaIsValid_ShouldReturnCreatedArea()
    {
        await _factory.ResetDatabaseAsync();
        var client = await _factory.CreateAdminClientAsync();
        var request = new CreateMapAreaDto
        {
            Name = "Vinewood",
            Description = "Integration test area.",
            Color = "#2563eb",
            Points = new[]
            {
                new CreateMapAreaPointDto { X = 10, Y = 10, Order = 0 },
                new CreateMapAreaPointDto { X = 20, Y = 10, Order = 1 },
                new CreateMapAreaPointDto { X = 20, Y = 20, Order = 2 },
            },
        };

        var createResponse = await client.PostAsJsonAsync("/api/MapAreas", request);

        Assert.Equal(HttpStatusCode.OK, createResponse.StatusCode);
        var createdArea = await createResponse.Content.ReadFromJsonAsync<MapAreaDto>();
        Assert.NotNull(createdArea);
        Assert.Equal("Vinewood", createdArea.Name);

        var getResponse = await client.GetAsync("/api/MapAreas");

        Assert.Equal(HttpStatusCode.OK, getResponse.StatusCode);
        var areas = await getResponse.Content.ReadFromJsonAsync<List<MapAreaDto>>();
        var area = Assert.Single(areas!);
        Assert.Equal(createdArea.Id, area.Id);
        Assert.Equal(new[] { 0, 1, 2 }, area.Points.Select(point => point.Order));
    }

    [Fact]
    public async Task Create_WhenAreaHasInvalidColor_ShouldReturnBadRequest()
    {
        await _factory.ResetDatabaseAsync();
        var client = await _factory.CreateAdminClientAsync();
        var request = new CreateMapAreaDto
        {
            Name = "Invalid area",
            Color = "blue",
            Points = new[]
            {
                new CreateMapAreaPointDto { X = 10, Y = 10, Order = 0 },
                new CreateMapAreaPointDto { X = 20, Y = 10, Order = 1 },
                new CreateMapAreaPointDto { X = 20, Y = 20, Order = 2 },
            },
        };

        var response = await client.PostAsJsonAsync("/api/MapAreas", request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Update_WhenAreaExists_ShouldReplaceAreaDataAndPoints()
    {
        await _factory.ResetDatabaseAsync();
        var client = await _factory.CreateAdminClientAsync();
        var createRequest = new CreateMapAreaDto
        {
            Name = "Old area",
            Description = "Old description.",
            Color = "#2563eb",
            Points = new[]
            {
                new CreateMapAreaPointDto { X = 10, Y = 10, Order = 0 },
                new CreateMapAreaPointDto { X = 20, Y = 10, Order = 1 },
                new CreateMapAreaPointDto { X = 20, Y = 20, Order = 2 },
            },
        };

        var createResponse = await client.PostAsJsonAsync("/api/MapAreas", createRequest);
        var createdArea = await createResponse.Content.ReadFromJsonAsync<MapAreaDto>();

        Assert.Equal(HttpStatusCode.OK, createResponse.StatusCode);
        Assert.NotNull(createdArea);

        var updateRequest = new UpdateMapAreaDto
        {
            Name = "Updated area",
            Description = "Updated description.",
            Color = "#facc15",
            Points = new[]
            {
                new CreateMapAreaPointDto { X = 300, Y = 100, Order = 0 },
                new CreateMapAreaPointDto { X = 400, Y = 100, Order = 1 },
                new CreateMapAreaPointDto { X = 400, Y = 200, Order = 2 },
            },
        };

        var updateResponse = await client.PutAsJsonAsync(
            $"/api/MapAreas/{createdArea.Id}",
            updateRequest);
        var updatedArea = await updateResponse.Content.ReadFromJsonAsync<MapAreaDto>();

        Assert.Equal(HttpStatusCode.OK, updateResponse.StatusCode);
        Assert.NotNull(updatedArea);
        Assert.Equal(createdArea.Id, updatedArea.Id);
        Assert.Equal("Updated area", updatedArea.Name);
        Assert.Equal("Updated description.", updatedArea.Description);
        Assert.Equal("#facc15", updatedArea.Color);
        Assert.Equal(new[] { 300d, 400d, 400d }, updatedArea.Points.Select(point => point.X));

        var getResponse = await client.GetAsync("/api/MapAreas");
        var areas = await getResponse.Content.ReadFromJsonAsync<List<MapAreaDto>>();
        var savedArea = Assert.Single(areas!);

        Assert.Equal("Updated area", savedArea.Name);
        Assert.Equal(new[] { 100d, 100d, 200d }, savedArea.Points.Select(point => point.Y));
    }

    [Fact]
    public async Task Delete_WhenAreaExists_ShouldRemoveArea()
    {
        await _factory.ResetDatabaseAsync();
        var client = await _factory.CreateAdminClientAsync();
        var createRequest = new CreateMapAreaDto
        {
            Name = "Area to delete",
            Color = "#2563eb",
            Points = new[]
            {
                new CreateMapAreaPointDto { X = 10, Y = 10, Order = 0 },
                new CreateMapAreaPointDto { X = 20, Y = 10, Order = 1 },
                new CreateMapAreaPointDto { X = 20, Y = 20, Order = 2 },
            },
        };

        var createResponse = await client.PostAsJsonAsync("/api/MapAreas", createRequest);
        var createdArea = await createResponse.Content.ReadFromJsonAsync<MapAreaDto>();

        Assert.Equal(HttpStatusCode.OK, createResponse.StatusCode);
        Assert.NotNull(createdArea);

        var deleteResponse = await client.DeleteAsync($"/api/MapAreas/{createdArea.Id}");
        var deletedArea = await deleteResponse.Content.ReadFromJsonAsync<MapAreaDto>();

        Assert.Equal(HttpStatusCode.OK, deleteResponse.StatusCode);
        Assert.NotNull(deletedArea);
        Assert.Equal(createdArea.Id, deletedArea.Id);

        var getResponse = await client.GetAsync("/api/MapAreas");
        var areas = await getResponse.Content.ReadFromJsonAsync<List<MapAreaDto>>();

        Assert.Equal(HttpStatusCode.OK, getResponse.StatusCode);
        Assert.Empty(areas!);
    }

    [Fact]
    public async Task Update_WhenAreaHasFewerThanThreePoints_ShouldReturnBadRequest()
    {
        await _factory.ResetDatabaseAsync();
        var client = await _factory.CreateAdminClientAsync();
        var createResponse = await client.PostAsJsonAsync("/api/MapAreas", new CreateMapAreaDto
        {
            Name = "Area to validate",
            Color = "#2563eb",
            Points = new[]
            {
                new CreateMapAreaPointDto { X = 10, Y = 10, Order = 0 },
                new CreateMapAreaPointDto { X = 20, Y = 10, Order = 1 },
                new CreateMapAreaPointDto { X = 20, Y = 20, Order = 2 },
            },
        });
        var createdArea = await createResponse.Content.ReadFromJsonAsync<MapAreaDto>();

        Assert.NotNull(createdArea);

        var response = await client.PutAsJsonAsync($"/api/MapAreas/{createdArea.Id}", new UpdateMapAreaDto
        {
            Name = "Invalid update",
            Color = "#2563eb",
            Points = new[]
            {
                new CreateMapAreaPointDto { X = 10, Y = 10, Order = 0 },
                new CreateMapAreaPointDto { X = 20, Y = 10, Order = 1 },
            },
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}
