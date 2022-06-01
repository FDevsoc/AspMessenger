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
    public class AuthorizationController : Controller
    {
        ApplicationContext db;
        public AuthorizationController(ApplicationContext context)
        {
            db = context;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult NotExist()
        {
            return View("NotExist");
        }

        [HttpPost]
        public async Task<IActionResult> Index(string login, string password)
        {
            if (login != null && password != null)
            {
                User? user = await db.Users.FirstOrDefaultAsync(p => p.Login == login && p.Password == password);
                if (user != null)
                {
                    // Заглушка
                    return Redirect("Home");
                }
            }
            return NotExist();
        }
    }
}
