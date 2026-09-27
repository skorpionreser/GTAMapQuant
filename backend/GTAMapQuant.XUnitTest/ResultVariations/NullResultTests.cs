using GTAMapQuant.BLL.MediatR.ResultVariations;
using Xunit;

namespace GTAMapQuant.XUnitTest.ResultVariations;

public class NullResultTests
{
    [Fact]
    public void Constructor_ShouldCreateSuccessfulResultWithNullValue()
    {
        var result = new NullResult<string>();

        Assert.True(result.IsSuccess);
        Assert.Null(result.Value);
    }
}
