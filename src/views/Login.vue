<template>
  <div class="mt-60">
    <div class="columns services-cards is-vcentered is-multiline">
      <div class="column"></div>
      <div class="column">
        <!-- Login Module -->
        <div v-if="showLogin" class="column is-8 is-offset-2 animated fadeIn">
          <div class="md-card has-text-centered mb-20 is-card-reveal">
            <div>
              <img src="../assets/capture.png" alt="Help & Support" width="100px" height="100px">
            </div>
            <div class="card-title mb-10">
              <b>Console Login</b>
            </div>
            <div class="card-feature-description">
              <!-- Email Input Control -->
              <div class="mb-10">
                <div class="control has-icons-left">
                  <input
                    class="input is-info is-hovered is-medium"
                    type="email"
                    placeholder="Email"
                    v-model="email"
                  >
                  <span class="icon is-small is-left">
                    <i class="fa fa-envelope"></i>
                  </span>
                </div>
              </div>
              <!-- Password Input Control -->
              <div class="mb-10">
                <div class="control has-icons-left">
                  <input
                    v-on:keyup.enter="authenticate"
                    class="input is-info is-hovered is-medium"
                    type="password"
                    placeholder="Password"
                    v-model="password"
                  >
                  <span class="icon is-small is-left">
                    <i class="fa fa-lock"></i>
                  </span>
                </div>
              </div>
              <!-- Button Control -->
              <div>
                <button
                  v-if="!authenticating"
                  class="button is-link"
                  v-on:click="authenticate"
                >Sign In</button>
                <a v-if="authenticating" class="button is-link is-loading" disabled>Loading</a>
              </div>
              <div class="mt-10">
                <button
                  class="button is-success is-outlined"
                  v-on:click="showRegisteration"
                >No account? Create one</button>
              </div>
              <!-- Notification Section -->
              <div v-if="showLoginError" class="notification mt-10 is-danger animated slideInUp">
                <button class="delete"></button>
                <div>{{ errorMessage }}</div>
              </div>
              <div
                v-if="showLoginFormError"
                class="notification mt-10 is-danger animated slideInUp"
              >
                <button class="delete"></button>
                <div>{{ errorMessage }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Registration Module -->
        <div v-if="showRegister" class="column is-three-fifths is-offset-one-fifth animated fadeIn">
          <div class="md-card has-text-centered mb-20 is-card-reveal">
            <div>
              <img src="../assets/capture.png" alt="Help & Support" width="100px" height="100px">
            </div>
            <div class="card-title mb-10">
              <b>Create Partner Account</b>
            </div>
            <div class="card-feature-description">
              <!-- Email Input Control -->
              <div class="mb-10">
                <div class="control has-icons-left">
                  <input
                    class="input is-info is-hovered is-medium"
                    type="email"
                    placeholder="Email"
                    v-model="email"
                  >
                  <span class="icon is-small is-left">
                    <i class="fa fa-envelope"></i>
                  </span>
                </div>
              </div>
              <!-- Password Input Control -->
              <div class="mb-10">
                <div class="control has-icons-left">
                  <input
                    class="input is-info is-hovered is-medium"
                    type="password"
                    placeholder="Password"
                    v-model="password"
                  >
                  <span class="icon is-small is-left">
                    <i class="fa fa-lock"></i>
                  </span>
                </div>
              </div>
              <!-- Button Control -->
              <div>
                <button
                  v-if="!registering"
                  class="button is-link"
                  v-on:click="register"
                >Create Account</button>
                <a v-if="registering" class="button is-link is-loading" disabled>Loading</a>
              </div>
              <div class="mt-10">
                <button
                  class="button is-success is-outlined"
                  v-on:click="showAuthentication"
                >Got an account? Sign In</button>
              </div>
              <!-- Notification Section -->
              <div
                v-if="showRegistrationSuccess"
                class="notification mt-10 is-success animated slideInUp"
              >
                <button class="delete"></button>
                <div>Account created successfully. A verification email has been sent to you.</div>
              </div>
              <div
                v-if="showRegistrationError"
                class="notification mt-10 is-danger animated slideInUp"
              >
                <button class="delete"></button>
                <div>{{ errorMessage }}</div>
              </div>
              <div
                v-if="showRegistrationFormError"
                class="notification mt-10 is-danger animated slideInUp"
              >
                <button class="delete"></button>
                <div>{{ errorMessage }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="column"></div>
    </div>
  </div>
</template>
<script>
import { auth } from "../services/Firebase";

export default {
  data() {
    return {
      email: null,
      password: null,
      authenticating: false,
      registering: false,
      showLogin: true,
      showLoginError: false,
      showRegister: false,
      showRegistrationError: false,
      showRegistrationSuccess: false,
      showRegistrationFormError: false,
      showLoginFormError: false,
      errorMessage: null
    };
  },
  methods: {
    showRegisteration() {
      this.reset();
      this.showLogin = false;
      this.showRegister = true;
    },
    showAuthentication() {
      this.reset();
      this.showLogin = true;
      this.showRegister = false;
    },
    validateEmail() {
      return this.email === null || this.email === "";
    },
    validatePassword() {
      return this.password === null || this.email === "";
    },
    reset() {
      // reset form to initial state
      this.email = null;
      this.password = null;
      this.authenticating = false;
      this.registering = false;
      this.showLoginError = false;
      this.showRegistrationError = false;
      this.errorMessage = null;
      this.showLogin = true;
      this.showRegister = false;
      this.showRegistrationSuccess = false;
      this.showRegistrationFormError = false;
      this.showLoginFormError = false;
    },
    authenticate() {
      const self = this;
      if (this.validateEmail() || this.validatePassword()) {
        this.showLoginFormError = true;
        this.errorMessage = "Invalid email or password";
        setTimeout(() => {
          this.showLoginFormError = false;
          this.errorMessage = "";
        }, 3000);
      } else {
        self.authenticating = true;
        auth
          .signInWithEmailAndPassword(this.email, this.password)
          .then(() => {
            this.$root.$data.authenticated();
            self.authenticating = false;
            this.$router.push("/console/dashboard");
          })
          .catch(() => {
            // Handle Errors here.
            self.authenticating = false;
            self.showLoginError = true;
            self.errorMessage = "Email or password is incorrect!";
            setTimeout(() => {
              self.showLoginError = false;
            }, 3000);
          });
      }
    },
    register() {
      const self = this;
      if (this.validateEmail() || this.validatePassword()) {
        this.showRegistrationFormError = true;
        this.errorMessage = "Invalid email or password";
        setTimeout(() => {
          this.showRegistrationFormError = false;
          this.errorMessage = "";
        }, 3000);
      } else {
        self.registering = true;
        auth
          .createUserWithEmailAndPassword(this.email, this.password)
          .then(() => {
            auth.currentUser
              .sendEmailVerification()
              .then(() => {
                self.showRegistrationSuccess = true;
                setTimeout(() => {
                  self.showRegistrationSuccess = false;
                  self.registering = false;
                  self.reset();
                }, 3000);
              })
              .catch(() => {
                self.registering = false;
                setTimeout(() => {
                  self.errorMessage =
                    "Unable to sign you up at this moment! Please try again";
                  self.showRegistrationError = false;
                }, 3000);
              });
          })
          .catch(error => {
            // Handle Errors here.
            self.registering = false;
            self.showRegistrationError = true;
            if (error.code == "auth/weak-password") {
              self.errorMessage = "The password is too weak.";
            } else {
              self.errorMessage = error.message;
            }
            setTimeout(() => {
              self.showRegistrationError = false;
            }, 3000);
          });
      }
    }
  },
  mounted() {
    this.reset();
  }
};
</script>
