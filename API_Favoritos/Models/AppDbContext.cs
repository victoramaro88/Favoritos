using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace API_Favoritos.Models
{
    public partial class AppDbContext : DbContext
    {
        public AppDbContext()
        {
        }

        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Categorium> Categoria { get; set; } = null!;
        public virtual DbSet<Site> Sites { get; set; } = null!;
        public virtual DbSet<Status> Statuses { get; set; } = null!;
        public virtual DbSet<StatusTipo> StatusTipos { get; set; } = null!;
        public virtual DbSet<SttTpo> SttTpos { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseSqlServer("Data Source=victoramaro.com.br, 11433;Initial Catalog=DB_Favoritos;User ID=f4v08170sBd;Password=s3p58?0aJ");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Categorium>(entity =>
            {
                entity.HasKey(e => e.CatCodi)
                    .HasName("PK__Categori__76CFC30368026E2C");

                entity.ToTable("Categoria", "schFavoritos");

                entity.Property(e => e.CatCodi)
                    .ValueGeneratedNever()
                    .HasColumnName("catCodi");

                entity.Property(e => e.CatDesc)
                    .HasMaxLength(250)
                    .IsUnicode(false)
                    .HasColumnName("catDesc");

                entity.Property(e => e.CatPai).HasColumnName("catPai");

                entity.Property(e => e.SttCodi).HasColumnName("sttCodi");

                entity.HasOne(d => d.CatPaiNavigation)
                    .WithMany(p => p.InverseCatPaiNavigation)
                    .HasForeignKey(d => d.CatPai)
                    .HasConstraintName("FK_Categoria_Categoria");
            });

            modelBuilder.Entity<Site>(entity =>
            {
                entity.HasKey(e => e.SitCodi)
                    .HasName("PK__Site__23F1A7DB3C336BDF");

                entity.ToTable("Site", "schFavoritos");

                entity.Property(e => e.SitCodi)
                    .ValueGeneratedNever()
                    .HasColumnName("sitCodi");

                entity.Property(e => e.CatCodi).HasColumnName("catCodi");

                entity.Property(e => e.SitDesc)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("sitDesc");

                entity.Property(e => e.SitLink)
                    .HasMaxLength(1000)
                    .IsUnicode(false)
                    .HasColumnName("sitLink");

                entity.Property(e => e.SitObse)
                    .HasMaxLength(1000)
                    .IsUnicode(false)
                    .HasColumnName("sitObse");

                entity.Property(e => e.SttCodi).HasColumnName("sttCodi");

                entity.HasOne(d => d.CatCodiNavigation)
                    .WithMany(p => p.Sites)
                    .HasForeignKey(d => d.CatCodi)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Cat_Site");

                entity.HasOne(d => d.SttCodiNavigation)
                    .WithMany(p => p.Sites)
                    .HasForeignKey(d => d.SttCodi)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_SttCodi_Site");
            });

            modelBuilder.Entity<Status>(entity =>
            {
                entity.HasKey(e => e.SttCodi)
                    .HasName("PK__Status__066BCDD11ABB8A2A");

                entity.ToTable("Status", "schFavoritos");

                entity.Property(e => e.SttCodi)
                    .ValueGeneratedNever()
                    .HasColumnName("sttCodi");

                entity.Property(e => e.SttDesc)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("sttDesc");

                entity.Property(e => e.TipCodi).HasColumnName("tipCodi");

                entity.HasOne(d => d.TipCodiNavigation)
                    .WithMany(p => p.Statuses)
                    .HasForeignKey(d => d.TipCodi)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_StatusTipo");
            });

            modelBuilder.Entity<StatusTipo>(entity =>
            {
                entity.HasKey(e => e.TipCodi)
                    .HasName("PK__StatusTi__43C0F009397725B3");

                entity.ToTable("StatusTipo", "schFavoritos");

                entity.Property(e => e.TipCodi)
                    .ValueGeneratedNever()
                    .HasColumnName("tipCodi");

                entity.Property(e => e.TipDesc)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("tipDesc");

                entity.Property(e => e.TipStat).HasColumnName("tipStat");
            });

            modelBuilder.Entity<SttTpo>(entity =>
            {
                entity.HasKey(e => e.SttTpoC)
                    .HasName("PK__SttTpo__069507C838D9EA58");

                entity.ToTable("SttTpo", "schFavoritos");

                entity.Property(e => e.SttTpoC)
                    .ValueGeneratedNever()
                    .HasColumnName("sttTpoC");

                entity.Property(e => e.SttCodi).HasColumnName("sttCodi");

                entity.Property(e => e.TipCodi).HasColumnName("tipCodi");

                entity.HasOne(d => d.SttCodiNavigation)
                    .WithMany(p => p.SttTpos)
                    .HasForeignKey(d => d.SttCodi)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_SttStatus");

                entity.HasOne(d => d.TipCodiNavigation)
                    .WithMany(p => p.SttTpos)
                    .HasForeignKey(d => d.TipCodi)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_SttStatusTipo");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
