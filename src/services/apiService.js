import http from "../http-common";

class JeffiService {

  // Conventions
  getConventions(){
    return http.get(`/conventions`);
  }
  getConvention(id){
    return http.get(`/conventions/${id}`);
  }

  addConvention(data){
    return http.post(`/conventions`, data);
  }

  updateConvention(data){
    return http.put(`/conventions/${data.id}`, data);
  }

  deleteConvention(id){
    return http.delete(`/conventions/${id}`);
  }

  // Commitments
  getCommitments(){
    return http.get(`/commitments`);
  }
  getCommitment(id){
    return http.get(`/commitments/${id}`);
  }

  addCommitment(data){
    return http.post(`/commitments`, data);
  }

  updateCommitment(data){
    return http.put(`/commitments/${data.id}`, data);
  }

  deleteCommitment(id){
    return http.delete(`/commitments/${id}`);
  }

  // Contractors
  getContractors(){
    return http.get(`/contractors`);
  }
  getContractor(id){
    return http.get(`/contractors/${id}`);
  }

  // Spendings
  getConventionSpendings(){
    return http.get(`/conventionspendings`);
  }

  // Invoices
  getInvoices(){
    return http.get(`/invoices`);
  }
  getInvoice(id){
    return http.get(`/invoices/${id}`);
  }

  //catgories

  getCategoriesType(){
    return http.get(`/categoriestype`);
  }
  addCategorie(data){
    return http.post(`/categories`, data);
  }




  addInvoice(data){
    return http.post(`/invoices`, data);
  }

  updateInvoice(data){
    return http.put(`/invoices/${data.id}`, data);
  }

  deleteInvoice(id){
    return http.delete(`/invoices/${id}`);
  }

  // Deadlines
  getConventionDeadlines(){
    return http.get(`/deadlines`);
  }

  /// Dusbursments
  getDisbursements(){
    return http.get(`/disbursements`);
  }
  addDibursement(data){
    return http.post(`/disbursements`, data);
  }

  /// Funders
  getFunders(){
    return http.get(`/funders`);
  }
  getFunder(id){
    return http.get(`/funders/${id}`);
  }


  getBorrowers(){
    return http.get(`/borrowers`);
  }
  getBorrower(id){
    return http.get(`/borrowers/${id}`);
  }

  getCurrencies(){
    return http.get(`/currencies`);
  }
  getCurrency(id){
    return http.get(`/currencies/${id}`);
  }


  // USERS
  login(phone, password) {
    return http.get(`/users/${phone}/${password}`);
  }

  newUser(data) {
    return http.post("/users/add", data);
  }

  getUsers() {
    return http.get("/users/allUsers");
  }

}

export default new JeffiService();