using Messenger.Models;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace Messenger.Controllers
{
    public class ChatHub : Hub
    {
        ApplicationContext db;

        public ChatHub(ApplicationContext context)
        {
            db = context;
        }

        public async Task GetData(string userName)
        {
            var currentClient = (from u in db.Users
                                where u.Name == userName
                                select new Client(u.Id, u.Name)).FirstOrDefault();

            var messages = (from m in db.Messages
                            where currentClient.Id == m.SenderId || currentClient.Id == m.ReceiverId
                            select m).ToList();

            var friendList = GetFriends(currentClient.Id, messages);


            await Clients.Client(Context.ConnectionId).SendAsync("GetData", currentClient, messages, friendList);
        }

        public async Task SendData(Client currentClient, Message message)
        {
            db.Messages.Add(message);
            db.SaveChanges();

            await GetData(currentClient.Name);
        }

        List<Client> GetFriends(int userId, List<Message> messages)
        {
            var senderList = (from m in messages
                              where userId != m.SenderId
                              select m.SenderId).Distinct().ToList();

            var receiverList = (from m in messages
                                where userId != m.ReceiverId
                                select m.ReceiverId).Distinct().ToList();

            var friendsId = (senderList.Concat(receiverList)).Distinct();

            var allUsers = (from u in db.Users
                            select u).ToList();


            return (from u in allUsers
                    from f in friendsId
                    where u.Id == f
                    select new Client(u.Id, u.Name)).ToList();
        }
    }
}
