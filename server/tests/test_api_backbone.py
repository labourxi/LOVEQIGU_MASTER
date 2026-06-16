import unittest

from server.api.router import register_routes, dispatch


class ApiBackboneTest(unittest.TestCase):
    def test_routes_registered(self):
        routes = register_routes()
        expected = [
            "GET /api/merchant/dashboard",
            "GET /api/merchant/coupons",
            "GET /api/merchant/tickets",
            "GET /api/park/dashboard",
            "GET /api/park/activities",
            "GET /api/platform/dashboard",
            "GET /api/platform/reviews",
            "GET /api/event/list",
            "GET /api/event/detail/{id}",
            "GET /api/event/tasks",
            "GET /api/event/assets",
        ]
        for route in expected:
            self.assertIn(route, routes)

    def test_endpoints_return_success(self):
        checks = [
            ("GET", "/api/merchant/dashboard", {}),
            ("GET", "/api/merchant/coupons", {}),
            ("GET", "/api/merchant/tickets", {}),
            ("GET", "/api/park/dashboard", {}),
            ("GET", "/api/park/activities", {}),
            ("GET", "/api/platform/dashboard", {}),
            ("GET", "/api/platform/reviews", {}),
            ("GET", "/api/event/list", {}),
            ("GET", "/api/event/detail/activity_loveqigu_first_event_v1", {}),
            ("GET", "/api/event/tasks", {}),
            ("GET", "/api/event/assets", {}),
        ]
        for method, path, params in checks:
            with self.subTest(path=path):
                response = dispatch(method, path, **params)
                self.assertTrue(response["success"])
                self.assertEqual(response["message"], "ok")
                self.assertIn("data", response)


if __name__ == "__main__":
    unittest.main()

