using System;
using System.Collections.Generic;

namespace API_Favoritos.Models
{
    public partial class Status
    {
        public Status()
        {
            Sites = new HashSet<Site>();
            SttTpos = new HashSet<SttTpo>();
        }

        public int SttCodi { get; set; }
        public string SttDesc { get; set; } = null!;
        public int TipCodi { get; set; }

        public virtual StatusTipo TipCodiNavigation { get; set; } = null!;
        public virtual ICollection<Site> Sites { get; set; }
        public virtual ICollection<SttTpo> SttTpos { get; set; }
    }
}
