using System;
using System.Collections.Generic;

namespace API_Favoritos.Models
{
    public partial class Categorium
    {
        public Categorium()
        {
            InverseCatPaiNavigation = new HashSet<Categorium>();
            Sites = new HashSet<Site>();
        }

        public int CatCodi { get; set; }
        public string CatDesc { get; set; } = null!;
        public int? CatPai { get; set; }
        public int SttCodi { get; set; }

        public virtual Categorium? CatPaiNavigation { get; set; }
        public virtual ICollection<Categorium> InverseCatPaiNavigation { get; set; }
        public virtual ICollection<Site> Sites { get; set; }
    }
}
