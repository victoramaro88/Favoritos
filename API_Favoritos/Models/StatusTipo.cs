using System;
using System.Collections.Generic;

namespace API_Favoritos.Models
{
    public partial class StatusTipo
    {
        public StatusTipo()
        {
            Statuses = new HashSet<Status>();
            SttTpos = new HashSet<SttTpo>();
        }

        public int TipCodi { get; set; }
        public string TipDesc { get; set; } = null!;
        public bool TipStat { get; set; }

        public virtual ICollection<Status> Statuses { get; set; }
        public virtual ICollection<SttTpo> SttTpos { get; set; }
    }
}
