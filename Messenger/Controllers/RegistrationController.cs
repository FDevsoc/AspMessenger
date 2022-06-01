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
    public class RegistrationController : Controller
    {
        ApplicationContext db;
        public RegistrationController(ApplicationContext context)
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
        public async Task<IActionResult> Index(User user)
        {
            if (await db.Users.FirstOrDefaultAsync(p => p.Name == user.Name || p.Login == user.Login) == null)
            {
                db.Users.Add(user);
                await db.SaveChangesAsync();
                return Redirect("Home");
            }
            return NotExist();
        }
    }
}
