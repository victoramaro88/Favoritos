using System;
using System.Collections.Generic;

namespace API_Favoritos.Models
{
    public partial class Site
    {
        public int SitCodi { get; set; }
        public string SitDesc { get; set; } = null!;
        public string SitLink { get; set; } = null!;
        public string? SitObse { get; set; }
        public int SttCodi { get; set; }
        public int CatCodi { get; set; }

        public virtual Categorium CatCodiNavigation { get; set; } = null!;
        public virtual Status SttCodiNavigation { get; set; } = null!;
    }
}
