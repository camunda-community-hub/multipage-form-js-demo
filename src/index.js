import { Form } from "@bpmn-io/form-js-viewer";
import './style.css';

import multipageFormSchema from "./forms/multipage-example.form";

const state = {
  currentPage: null,
  pages: null,
  data: {}
};

const registerNavigation = () => {
  document.getElementById('form-pagination-back').addEventListener('click', loadPreviousPage);
  document.getElementById('form-pagination-next').addEventListener('click', loadNextPage);
  document.getElementById('form-pagination-submit').addEventListener('click', submitForm);
}

const loadPreviousPage = () => {
  if (state.currentPage.isFirst) return;

  parseAndLoadPage(state.pages, state.currentPage.index - 1);
};

const loadNextPage = () => {
  if (state.currentPage.isLast) return;

  // get data
  const {
    data,
    errors
  } = form.submit();

  // if validation error, prevent navigation
  if (Object.keys(errors).length) return;

  // no deep merge, adjust here if you need it
  state.data = {
    ...state.data,
    ...data
  }

  parseAndLoadPage(state.pages, state.currentPage.index + 1);
};

const submitForm = () => {
  if (!state.currentPage.isLast) return;
};

const parseAndLoadPage = (pages, index) => {
  const page = parsePage(pages, index);
  loadPage(page);
  state.pages = pages;
};

const loadPage = (page) => {
  form.importSchema(page, state.data);

  document.getElementById('form-pagination-back').setAttribute('data-active', page.isFirst ? 'disabled' : 'enabled');
  document.getElementById('form-pagination-next').setAttribute('data-active', page.isLast ? 'disabled' : 'enabled');
  document.getElementById('form-pagination-submit').setAttribute('data-active', page.isLast ? 'enabled' : 'disabled');

  state.currentPage = page;
};

const parsePage = (pages, index) => {
  if (!pages[index]) return;

  if (pages[index].type != "page") return;

  return {
    ...pages[index],
    isLast: !pages[index + 1],
    isFirst: (index == 0),
    index: index,
    type: "default"
  };
};

const importMultiPageFormSchema = ({ type, id, pages }) => {
  if (type !== "multipage") throw "Not multipage";
  parseAndLoadPage(pages, 0);
};

const form = new Form({
  container: document.querySelector("#form-page-container"),
});

importMultiPageFormSchema(multipageFormSchema);
registerNavigation();
