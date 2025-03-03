using System;
using System.Collections.Generic;

namespace API_Favoritos.Models
{
    public partial class SttTpo
    {
        public int SttTpoC { get; set; }
        public int SttCodi { get; set; }
        public int TipCodi { get; set; }

        public virtual Status SttCodiNavigation { get; set; } = null!;
        public virtual StatusTipo TipCodiNavigation { get; set; } = null!;
    }
}
