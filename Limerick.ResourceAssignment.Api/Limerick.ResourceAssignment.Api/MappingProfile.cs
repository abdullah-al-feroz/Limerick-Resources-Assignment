using AutoMapper;
using Limerick.ResourceAssignment.Api.DTOs;
using Limerick.ResourceAssignment.Api.Model;

namespace Limerick.ResourceAssignment.Api
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // User mappings
            CreateMap<User, RegisterDto>();
            CreateMap<RegisterDto, User>();

            // Product mappings
            CreateMap<Product, ProductDto>().ReverseMap();

            // Sale mappings
            CreateMap<Sale, SaleDto>().ReverseMap();
        }
    }
}
