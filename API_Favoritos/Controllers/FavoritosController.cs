using API_Favoritos.Models;
using API_Favoritos.Models.DTO;
using Microsoft.AspNetCore.Mvc;

namespace API_Favoritos.Controllers
{
    [Route("api/[controller]/[action]")]
    public class FavoritosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FavoritosController(IConfiguration configuration, AppDbContext context)
        {
            _context = context;
        }

        [HttpGet()]
        public IActionResult Teste()
        {
            return Ok("Retorno OK!");
        }

        [HttpGet()]
        public List<CatSubCatModel> GetFavoritos()
        {
            List<CatSubCatModel> catSubcat = ObterHierarquiaCategorias();

            return catSubcat;
        }

        [NonAction]
        private List<CatSubCatModel> ObterHierarquiaCategorias()
        {
            // 1. Buscar todas as categorias do banco
            var todasCategorias = _context.Categoria
                                    .OrderBy(c => c.CatDesc)
                                    .ToList();

            // 2. Converter as categorias para o modelo DTO
            var listaDto = todasCategorias.Select(c => new CatSubCatModel
            {
                CatCodi = c.CatCodi,
                CatDesc = c.CatDesc,
                CatPai = c.CatPai
            }).ToList();

            var sites = _context.Sites
                            .OrderBy(s => s.CatCodi)
                            .ToList();

            var lstSiteDTO = sites.Select(s => new SiteModel
            {
                sitCodi = s.CatCodi,
                sitDesc = s.SitDesc,
                sitLink = s.SitLink,
                sitObse = s.SitObse,
                sttCodi = s.SttCodi,
                catCodi = s.CatCodi
            });

            // 3. Método recursivo para estruturar a hierarquia
            List<CatSubCatModel> MontarHierarquia(List<CatSubCatModel> lista, int? catPai)
            {
                return lista
                    .Where(c => c.CatPai == catPai)
                    //.OrderBy(c => c.CatCodi)
                    .OrderBy(c => c.CatDesc)
                    .Select(c => new CatSubCatModel
                    {
                        CatCodi = c.CatCodi,
                        CatDesc = c.CatDesc,
                        CatPai = c.CatPai,
                        Sites = lstSiteDTO.Where(s => s.catCodi == c.CatCodi).ToList(), //-> Preenchendo os sites
                        SubCategorias = MontarHierarquia(lista, c.CatCodi) // Recursão
                    })
                    .ToList();
            }

            // 4. Iniciar a montagem da hierarquia
            return MontarHierarquia(listaDto, null);
        }

        [NonAction]
        private List<CatSubCatModel> PreencheSitesCategoria(List<CatSubCatModel> lstEntrada)
        {
            List<CatSubCatModel> lstRetorno = new List<CatSubCatModel>();

            var sites = _context.Sites
                            .OrderBy(s => s.CatCodi)
                            .ToList();

            var lstSiteDTO = sites.Select(s => new SiteModel
            {
                sitCodi = s.CatCodi,
                sitDesc = s.SitDesc,
                sitLink = s.SitLink,
                sitObse = s.SitObse,
                sttCodi = s.SttCodi,
                catCodi = s.CatCodi
            });

            CatSubCatModel objCat = new CatSubCatModel();
            foreach (var item in lstEntrada)
            {
                //objCat = new CatSubCatModel();
                //objCat = item.CatCodi;
            }

            return lstRetorno;
        }


        //[HttpGet()]
        //public List<(CatSubCatModel categoria, int nivel)> ObterHierarquiaCategoriasNiveladas()
        //{
        //    var todasCategorias = _context.Categoria.ToList();

        //    var listaDto = todasCategorias.Select(c => new CatSubCatModel
        //    {
        //        CatCodi = c.CatCodi,
        //        CatDesc = c.CatDesc,
        //        CatPai = c.CatPai
        //    }).ToList();

        //    List<(CatSubCatModel, int)> resultado = new List<(CatSubCatModel, int)>();

        //    void MontarHierarquia(List<CatSubCatModel> lista, int? catPai, int nivel)
        //    {
        //        foreach (var cat in lista.Where(c => c.CatPai == catPai).OrderBy(c => c.CatCodi))
        //        {
        //            resultado.Add((cat, nivel));
        //            MontarHierarquia(lista, cat.CatCodi, nivel + 1);
        //        }
        //    }

        //    MontarHierarquia(listaDto, null, 1);
        //    return resultado;
        //}
    }
}
