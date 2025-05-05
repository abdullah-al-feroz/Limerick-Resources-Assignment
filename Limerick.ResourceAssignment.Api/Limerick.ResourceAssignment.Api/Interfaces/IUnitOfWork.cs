namespace Limerick.ResourceAssignment.Api.Interfaces
{
    public interface IUnitOfWork
    {
        IProductRepository Products { get; }
        ISaleRepository Sales { get; }
        IUserRepository Users { get; }
        Task<int> CompleteAsync();
    }
}
