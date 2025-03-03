namespace API_Favoritos.Models.DTO
{
    public class CatSubCatModel
    {
        public int CatCodi { get; set; }
        public string? CatDesc { get; set; }
        public int? CatPai { get; set; } 
        public List<CatSubCatModel> SubCategorias { get; set; } = new List<CatSubCatModel>();
        public List<SiteModel> Sites { get; set; } = new List<SiteModel>(); 
    }
}
