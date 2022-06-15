using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Messenger.Models;

namespace Messenger.Controllers
{
    public class MainController : Controller
    {
        ApplicationContext db;
        User? _user;
        List<Message> _messages;

        public MainController(ApplicationContext context)
        {
            db = context;
        }

        public IActionResult Index()
        {
            if (HttpContext.Request.Cookies["User"] == null)
                return RedirectToAction("Index", "Home");

            // Получаем авторизованного пользователя
            GetUser();

            // Биндинг данных
            ViewData["User"] = _user.Name;

            _messages = (from m in db.Messages
                            where _user.Id == m.SenderId || _user.Id == m.ReceiverId
                            select m).ToList();
            ViewBag.Messages = _messages;


            var dialogs = (from m in _messages
                           select m.DialogId).ToList();
            ViewBag.Dialogs = dialogs.Distinct().ToList();

            ViewBag.FriendList = GetFriends();

            return View();
        }

        // Получить пользователя в системе
        public void GetUser()
        {
            var authString = HttpContext.Request.Cookies["User"];

            string[] dataList = authString.Split(' ');

            var login = dataList[0];
            var password = dataList[1];

            _user = db.Users.FirstOrDefault(p => p.Login == login && p.Password == password);
        }

        // Получить клиентов, с которыми есть диалоги
        List<Client> GetFriends()
        {
            var senderList = (from m in _messages
                              where _user.Id != m.SenderId
                              select m.SenderId).Distinct().ToList();

            var receiverList = (from m in _messages
                                where _user.Id != m.ReceiverId
                                select m.ReceiverId).Distinct().ToList();

            var friendsId = (senderList.Concat(receiverList)).Distinct();



            return (from u in GetAllUser()
                    from f in friendsId
                    where u.Id == f
                    select new Client(u.Id, u.Name)).ToList();
        }

        // Получить всех пользователей
        public List<User> GetAllUser()
        {
            return (from u in db.Users
                   select u).ToList();
        }
    }
}
