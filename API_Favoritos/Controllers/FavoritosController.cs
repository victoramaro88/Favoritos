using API_Favoritos.Models;
using API_Favoritos.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

        [HttpPost]
        public async Task<ActionResult<string>> PostCategoria([FromBody] CatSubCatModel objCategoria)
        {
            try
            {
                if (objCategoria.CatCodi == 0 && objCategoria.CatPai > 0) //-> INSERE SUBCATEGORIA
                {
                    objCategoria.CatCodi = _context.Categoria.Max(p => (int?)p.CatCodi) + 1 ?? 1;

                    Categorium objInsert = new Categorium();
                    objInsert.CatCodi = objCategoria.CatCodi;
                    objInsert.CatDesc = objCategoria.CatDesc!;
                    objInsert.CatPai = objCategoria.CatPai;

                    _context.Categoria.Add(objInsert);
                    await _context.SaveChangesAsync();

                    return Ok("Salvo com sucesso!");
                }
                else if(objCategoria.CatCodi == 0 && objCategoria.CatPai == 0) //-> INSERE CATEGORIA PADRÃO
                {
                    objCategoria.CatCodi = _context.Categoria.Max(p => (int?)p.CatCodi) + 1 ?? 1;

                    Categorium objInsert = new Categorium();
                    objInsert.CatCodi = objCategoria.CatCodi;
                    objInsert.CatDesc = objCategoria.CatDesc!;
                    objInsert.CatPai = null;

                    _context.Categoria.Add(objInsert);
                    await _context.SaveChangesAsync();

                    return Ok("Salvo com sucesso!");
                }
                else if (objCategoria.CatCodi != 0 && objCategoria.CatPai != 0 && objCategoria.CatCodi != objCategoria.CatPai) //-> ALTERA CATEGORIA EXISTENTE
                {
                    if (!CategoriaExists(objCategoria.CatCodi))
                    {
                        return NotFound("Registro não encontrado.");
                    }

                    Categorium objUpdate = new Categorium();
                    objUpdate.CatCodi = objCategoria.CatCodi;
                    objUpdate.CatDesc = objCategoria.CatDesc!;
                    objUpdate.CatPai = objCategoria.CatPai;

                    _context.Entry(objUpdate).State = EntityState.Modified;
                    await _context.SaveChangesAsync();

                    return Ok("Alterado com sucesso!");
                }
                else
                { 
                    return BadRequest("Parâmetros inválidos."); 
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message + " \n " + ex.InnerException?.Message);
            }
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

        private bool CategoriaExists(int catCodi)
        {
            return _context.Categoria.Any(e => e.CatCodi == catCodi);
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
