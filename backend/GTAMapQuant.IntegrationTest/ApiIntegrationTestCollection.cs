using Xunit;

namespace GTAMapQuant.IntegrationTest;

[CollectionDefinition(Name, DisableParallelization = true)]
public sealed class ApiIntegrationTestCollection : ICollectionFixture<GtaMapWebApplicationFactory>
{
    public const string Name = "API integration tests";
}
