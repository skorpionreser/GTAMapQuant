using System.Net;
using System.Net.Http.Json;
using GTAMapQuant.BLL.DTO.MapMarkers;
using GTAMapQuant.DAL.Entities;
using Xunit;

namespace GTAMapQuant.IntegrationTest;

public class MapMarkersEndpointsTests : IClassFixture<GtaMapWebApplicationFactory>
{
    private readonly GtaMapWebApplicationFactory _factory;

    public MapMarkersEndpointsTests(GtaMapWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task CrudLifecycle_WhenMarkerIsValid_ShouldReturnExpectedResponses()
    {
        await _factory.ResetDatabaseAsync();
        var client = _factory.CreateClient();
        var createRequest = new CreateMapMarkerDto
        {
            Name = "Ammu-Nation",
            Description = "Integration test marker.",
            Category = MarkerCategory.Shop,
            X = 50,
            Y = 75,
        };

        var createResponse = await client.PostAsJsonAsync("/api/MapMarkers", createRequest);

        Assert.Equal(HttpStatusCode.OK, createResponse.StatusCode);
        var createdMarker = await createResponse.Content.ReadFromJsonAsync<MapMarkerDto>();
        Assert.NotNull(createdMarker);

        var getByIdResponse = await client.GetAsync($"/api/MapMarkers/{createdMarker.Id}");
        Assert.Equal(HttpStatusCode.OK, getByIdResponse.StatusCode);

        var updateRequest = new UpdateMapMarkerDto
        {
            Name = "Updated Ammu-Nation",
            Description = "Updated marker.",
            Category = MarkerCategory.ServiceStation,
            X = 100,
            Y = 200,
        };
        var updateResponse = await client.PutAsJsonAsync(
            $"/api/MapMarkers/{createdMarker.Id}",
            updateRequest);

        Assert.Equal(HttpStatusCode.OK, updateResponse.StatusCode);
        var updatedMarker = await updateResponse.Content.ReadFromJsonAsync<MapMarkerDto>();
        Assert.NotNull(updatedMarker);
        Assert.Equal("Updated Ammu-Nation", updatedMarker.Name);

        var deleteResponse = await client.DeleteAsync($"/api/MapMarkers/{createdMarker.Id}");
        Assert.Equal(HttpStatusCode.OK, deleteResponse.StatusCode);

        var missingResponse = await client.GetAsync($"/api/MapMarkers/{createdMarker.Id}");
        Assert.Equal(HttpStatusCode.NotFound, missingResponse.StatusCode);
    }

    [Fact]
    public async Task Create_WhenMarkerIsInvalid_ShouldReturnBadRequest()
    {
        await _factory.ResetDatabaseAsync();
        var client = _factory.CreateClient();
        var request = new CreateMapMarkerDto
        {
            Name = string.Empty,
            Category = (MarkerCategory)99,
            X = 10,
            Y = 20,
        };

        var response = await client.PostAsJsonAsync("/api/MapMarkers", request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}
