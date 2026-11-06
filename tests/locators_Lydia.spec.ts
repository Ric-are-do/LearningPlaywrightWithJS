// @ts-check
import {test, expect } from '@playwright/test';
import {Page} from '@playwright/test';

async function login(page: Page){

  const userLoginEmail = 'rsmith@test.com';
  const userLoginPassword = 'GoodStuff007';
  const userEmail_locator = page.getByRole('textbox', {name:'Email'});
  const userPassword_locator = page.getByRole('textbox', {name:'Password'});
  const submitButton_locator = page.getByRole('button', {name:'Submit'});
 

    await expect(userEmail_locator).toBeVisible();
    await userEmail_locator.fill(userLoginEmail);
    await expect(userPassword_locator).toBeVisible();
    await userPassword_locator.fill(userLoginPassword);
    await expect(submitButton_locator).toBeVisible(); 
    await submitButton_locator.click(); 


}


async function logout(page: Page){
  const logoutButton_locator = page.getByText('Logout');
  
    await expect(logoutButton_locator).toBeVisible();
    await logoutButton_locator.click(); 

}



/**
 * 01 -- LOCATORS: how you tell Playwright which element you mean.
 *
 * A Locator is a lazy description of an element, not the element itself.
 * Nothing is looked up until you act (click, fill) or assert on it, which is
 * why locators survive re-renders that would break a captured element handle.
 *
 * Preference order, best first:
 *   1. getByRole      -- how assistive tech sees the page; survives restyling
 *   2. getByLabel / getByPlaceholder / getByText -- user-visible anchors
 *   3. getByTestId    -- an explicit contract with the developers
 *   4. CSS / XPath    -- last resort, breaks when markup is refactored
 *
 * Docs: https://playwright.dev/docs/locators
 */


test.describe('Lydia practice tests', () => {
  const landingPageURL = 'https://thinking-tester-contact-list.herokuapp.com/';
  const contactListURL = 'https://thinking-tester-contact-list.herokuapp.com/contactList';
  const addNewContactURL = 'https://thinking-tester-contact-list.herokuapp.com/addContact';
  const userLoginEmail = 'rsmith@test.com';
  const userLoginPassword = 'GoodStuff007';
  


  test.beforeEach(async ({ page }) => {
    await page.goto(landingPageURL);
  });


  test('signup test', async ({ page }) => {
    const signupButton_locator = page.getByRole('button', { name: 'Sign up' });
    const firstName_locator = page.getByRole('textbox', { name: 'First Name'}); 
    const lastName_locator = page.getByRole('textbox', {name: 'Last Name'}); 
    const email_locator = page.getByRole('textbox', {name: 'Email'}); 
    const password_locator = page.getByRole('textbox', {name: 'Password'}); 
    const submitButton_locator = page.getByRole('button', {name: 'Submit'});



    await expect(page).toHaveTitle('Contact List App');
    await expect(signupButton_locator).toBeVisible();
    await signupButton_locator.click();
    await expect(page).toHaveTitle('Add User');
    await firstName_locator.fill ('Ronald');
    await lastName_locator.fill ('Smith');
    await email_locator.fill (userLoginEmail);
    await password_locator.fill (userLoginPassword);
    await submitButton_locator.click();
    //await expect((/** @type {{ status: () => number; }} */ Response) => Response.status() === 201);
   

  });



  
  test('login test', async ({ page }) => {
    const logoutButton_locator = page.getByText('Logout');
    const addNewContactButton_locator = page.getByText('Add a New Contact');
    await expect(page).toHaveURL(landingPageURL); 
    await login(page);
    await expect(page).toHaveURL(contactListURL);
    await expect(logoutButton_locator).toBeVisible(); //to get this, go inspect > accessability
    await expect(page.getByText('Contact List')).toBeVisible();
    await expect (page.locator('id=add-contact')).toBeVisible(); 
   // await logout(page);
   
    //await page.locator('id=logout').click();

  
    //const response = await page.request.get('https://thinking-tester-contact-list.herokuapp.com/users/login');
   //await expect(response).toBeOK();
   //console.log(response.status());

  });


// getting by ID
     // await page.locator("id=Logout").click();
     //await page.locator("#Logout").click();



async function addNewContact(page: Page, firstName: string, lastName: string, dateOfBirth: string, email: string, phone: string, streetAddress1: string, streetAddress2: string, city: string, stateOrProvince: string, postalCode: string, country: string){
  const addNewContactButton_locator = page.getByRole('button', {name: 'Add a New Contact'});
  const testAddNewContactURL = 'https://thinking-tester-contact-list.herokuapp.com/addContact'; 
    await addNewContactButton_locator.click();
    await expect(page).toHaveURL(testAddNewContactURL);
    await expect(page.locator('id=firstName')).toBeVisible();
    await page.getByRole('textbox', { name: 'First Name:'}).fill (firstName);
    await page.getByRole ('textbox', { name: 'Last Name:'}).fill (lastName);
    await page.getByRole ('textbox', { name: 'Date of Birth:'}).fill (dateOfBirth); 
    await page.getByRole('textbox', { name: 'Email:'}).fill (email);
    await page.getByRole ('textbox', { name: 'Phone:'}).fill (phone);
    await page.getByRole ('textbox', { name: 'Street Address 1:'}).fill (streetAddress1);
    await page.getByRole ('textbox', { name: 'Street Address 2:'}).fill (streetAddress2);
    await page.getByRole ('textbox', { name: 'City:'}).fill (city); 
    await page.getByRole ('textbox', { name: 'State or Province:'}).fill (stateOrProvince); 
    await page.getByRole ('textbox', { name: 'Postal Code:'}).fill (postalCode);
    await page.getByRole ('textbox', { name: 'Country:'}).fill (country);
    await page.getByRole ('button', { name: 'Submit'}).click();
}


 test('adding new contacts', async ({ page}) => {
  

  const addNewContactButton_locator = page.getByRole('button', {name: 'Add a New Contact'});
  const testAddNewContactURL = 'https://thinking-tester-contact-list.herokuapp.com/addContact'; 
    await login(page);
    await expect (page).toHaveURL('https://thinking-tester-contact-list.herokuapp.com/');
    await expect(page).toHaveTitle('Contact List App');
    await addNewContactButton_locator.click();
    await expect(page).toHaveURL(testAddNewContactURL);
    await expect(page.locator('id=firstName')).toBeVisible();
    await page.getByRole('textbox', { name: 'First Name:'}).fill ('Samantha');
    await page.getByRole ('textbox', { name: 'Last Name:'}).fill ('Dirr');
    await page.getByRole ('textbox', { name: 'Date of Birth:'}).fill ('1990-01-12'); 
    await page.getByRole('textbox', { name: 'Email' }).fill('rsmith@test.com');
    //await page.getByRole('textbox', { name: 'Password' }).fill('GoodStuff007');
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByRole('button', { name: 'Add a New Contact'}).click();
    await page.getByRole('textbox', { name: 'First Name:'}).fill ('Samantha');
    await page.getByRole ('textbox', { name: 'Last Name:'}).fill ('Dirr');
    await page.getByRole ('textbox', { name: 'Date of Birth:'}).fill ('1990-01-12'); 
    await page.getByRole ('textbox', { name: 'Email:'}).fill ('sdirr@testers.com');
    await page.getByRole ('textbox', { name: 'Phone:'}).fill ('0820874464');
    await page.getByRole ('textbox', { name: 'Street Address 1:'}).fill ('702 Bates Road');
    await page.getByRole ('textbox', { name: 'Street Address 2:'}).fill ('Moreletapark');
    await page.getByRole ('textbox', { name: 'City:'}).fill ('Pretoria'); 
    await page.getByRole ('textbox', { name: 'State or Province:'}).fill ('Gautent'); 
    await page.getByRole ('textbox', { name: 'Postal Code:'}).fill ('0182');
    await page.getByRole ('textbox', { name: 'Country:'}).fill ('Wonderland');
    await page.getByRole ('button', { name: 'Submit'}).click();


 });

 







//await page.getByRole('button', { name: /submit/i }).click();

});






