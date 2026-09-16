using System.Net;
using System.Net.Http.Json;
using GTAMapQuant.BLL.DTO.MapAreas;
using Xunit;

namespace GTAMapQuant.IntegrationTest;

public class MapAreasEndpointsTests : IClassFixture<GtaMapWebApplicationFactory>
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
        var client = _factory.CreateClient();
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
        var client = _factory.CreateClient();
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
}
