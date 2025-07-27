@echo off
echo Starting authentication test and database seeding...

cd server
echo Running seed script...
node scripts/seedData.js

echo.
echo Testing authentication...
node test-auth.js

echo.
echo Database setup completed!
echo.
echo Test Credentials:
echo Supplier: rajesh@freshfarms.com / password123
echo Vendor: suresh@streetfood.com / password123
echo.
pause 