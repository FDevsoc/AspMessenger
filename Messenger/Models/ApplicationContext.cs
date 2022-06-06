using Microsoft.EntityFrameworkCore;

namespace Messenger.Models
{
    public class ApplicationContext : DbContext
    {
        public DbSet<User> Users { get; set; } = null!;

        public DbSet<Dialog> Dialogs { get; set; } = null!;

        public DbSet<Message> Messages { get; set; } = null!;

        public ApplicationContext(DbContextOptions<ApplicationContext> options)
            : base(options)
        {
            Database.EnsureCreated();
        }
    }
}
