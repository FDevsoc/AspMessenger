namespace Messenger.Models
{
    public class Dialog
    {
        public int Id { get; set; }

        public string? Name { get; set; }

        public Dialog() {}

        public Dialog(int id, string name)
        {
            Id = id;
            Name = Name;
        }
    }
}