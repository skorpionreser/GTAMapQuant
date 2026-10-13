using System.Net;
using System.Net.Http.Json;
using GTAMapQuant.BLL.DTO.MapModes;
using Xunit;

namespace GTAMapQuant.IntegrationTest;

[Collection(ApiIntegrationTestCollection.Name)]
public class MapModesEndpointsTests
{
    private readonly GtaMapWebApplicationFactory _factory;

    public MapModesEndpointsTests(GtaMapWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task CreateUpdateDelete_WhenAdminIsAuthorized_ShouldManageMapMode()
    {
        await _factory.ResetDatabaseAsync();
        var client = await _factory.CreateAdminClientAsync();
        var createRequest = new CreateMapModeDto
        {
            Name = "Event map",
            Description = "Event content only.",
            SortOrder = 2,
            IsDefault = true,
            ShowStandardMarkersByDefault = false,
        };

        var createResponse = await client.PostAsJsonAsync("/api/MapModes", createRequest);
        var createdMode = await createResponse.Content.ReadFromJsonAsync<MapModeDto>();

        Assert.Equal(HttpStatusCode.OK, createResponse.StatusCode);
        Assert.NotNull(createdMode);
        Assert.Equal("Event map", createdMode.Name);

        var contentResponse = await client.GetAsync($"/api/MapModes/{createdMode.Id}");
        var content = await contentResponse.Content.ReadFromJsonAsync<MapModeContentDto>();

        Assert.Equal(HttpStatusCode.OK, contentResponse.StatusCode);
        Assert.NotNull(content);
        Assert.Empty(content.Areas);
        Assert.Empty(content.Markers);

        var updateResponse = await client.PutAsJsonAsync($"/api/MapModes/{createdMode.Id}", new UpdateMapModeDto
        {
            Name = "Updated event map",
            Description = "Updated content.",
            SortOrder = 4,
            IsDefault = true,
            ShowStandardMarkersByDefault = true,
        });
        var updatedMode = await updateResponse.Content.ReadFromJsonAsync<MapModeDto>();

        Assert.Equal(HttpStatusCode.OK, updateResponse.StatusCode);
        Assert.NotNull(updatedMode);
        Assert.Equal("Updated event map", updatedMode.Name);

        var disposableResponse = await client.PostAsJsonAsync("/api/MapModes", new CreateMapModeDto
        {
            Name = "Disposable event map",
        });
        var disposableMode = await disposableResponse.Content.ReadFromJsonAsync<MapModeDto>();

        Assert.Equal(HttpStatusCode.OK, disposableResponse.StatusCode);
        Assert.NotNull(disposableMode);

        var deleteResponse = await client.DeleteAsync($"/api/MapModes/{disposableMode.Id}");

        Assert.Equal(HttpStatusCode.OK, deleteResponse.StatusCode);
    }

    [Fact]
    public async Task Create_WhenCallerIsAnonymous_ShouldReturnUnauthorized()
    {
        await _factory.ResetDatabaseAsync();
        var client = _factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/MapModes", new CreateMapModeDto
        {
            Name = "Anonymous mode",
        });

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }
}
