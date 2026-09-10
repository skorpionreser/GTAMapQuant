using FluentResults;

namespace GTAMapQuant.BLL.MediatR.ResultVariations;

public class NullResult<T> : Result<T>
{
    public NullResult()
        : base()
    {
    }
}