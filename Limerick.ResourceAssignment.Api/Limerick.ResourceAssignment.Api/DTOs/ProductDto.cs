namespace Limerick.ResourceAssignment.Api.DTOs
{
    public class ProductDto
    {
        public string Name { get; set; }
        public string SKU { get; set; }
        public decimal Price { get; set; }
        public int StockQty { get; set; }
        public string Description { get; set; }
    }
}
