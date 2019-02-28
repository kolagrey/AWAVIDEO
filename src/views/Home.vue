<template>
  <div class="mt-50">
    <div class="columns services-cards is-vcentered is-multiline">
      <div class="column">
        <div class="column mt-40" v-if="!blank">
          <div v-if="uploadEnd && !uploading" class="notification is-success animated slideInUp">
            <button class="delete" v-on:click="reset"></button>
            Video uploaded successfully!
          </div>
          <div v-if="uploadError" class="notification is-danger animated slideInUp">
            <button class="delete" v-on:click="resetError"></button>
            Unable to upload video, please try again!
          </div>
          <progress
            v-if="uploading"
            class="progress is-info"
            :value="progressUpload"
            max="100"
          >{{ progressUpload }}%</progress>
        </div>
        <div
          v-if="showCard"
          class="feature-card card-md hover-inset has-text-centered mb-20 is-card-reveal"
        >
          <div>
            <div>
              <h4>Record or select video</h4>
            </div>
            <div class="column has-text-centered is-pulled-left">
              <div class="file is-info">
                <label class="file-label">
                  <input
                    class="file-input"
                    type="file"
                    accept="video/*"
                    capture="camera"
                    id="recorder"
                    ref="myCameraFileInput"
                    :disabled="uploading"
                    v-on:change="cameraFilesChange($event.target.name, $event.target.files);"
                  >
                  <span class="file-cta">
                    <span class="file-icon">
                      <i class="fa fa-video-camera"></i>
                    </span>
                    <span class="file-label">Record</span>
                  </span>
                </label>
              </div>
            </div>
            <div class="column has-text-centered is-pulled-right">
              <div class="file is-primary">
                <label class="file-label">
                  <input
                    class="file-input"
                    type="file"
                    accept="video/*"
                    id="recorder"
                    ref="myVideoFileInput"
                    :disabled="uploading"
                    v-on:change="videoFilesChange($event.target.name, $event.target.files);"
                  >
                  <span class="file-cta">
                    <span class="file-icon">
                      <i class="fa fa-upload"></i>
                    </span>
                    <span class="file-label">Select</span>
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div v-if="!blank">
          <div class="column">
            <div v-if="!uploading && videoSource" class="animated slideInDown">
              <video :src="videoSource" style="height: 200px !important; width: 100% !important" id="player" controls></video>
            </div>
            <div class="animated fadeIn">
              <button
                v-if="!uploading && !uploadEnd"
                class="button is-info is-pulled-left"
                v-on:click="saveInit"
              >
                <i class="fa fa-upload"></i> Upload
              </button>
              <button
                v-if="!uploading && !uploadEnd"
                class="button is-danger is-pulled-right"
                v-on:click="reset"
              >
                <i class="fa fa-trash"></i> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="column">
        <div class="feature-card card-md hover-inset has-text-centered mb-20 is-card-reveal">
          <div>
            <img src="../assets/capture.png" alt="Awavideo" width="100px" height="100px">
          </div>
          <div class="card-title">
            <h4>Record . Contribute . Share</h4>
          </div>
          <div class="card-feature-description">
            <span class>Making field video capture really easy.</span>
          </div>
        </div>
      </div>
      <div class="column">
        <div class="feature-card card-md hover-inset has-text-centered mb-20 is-card-reveal">
          <div>
            <img src="../assets/support.png" alt="Help & Support" width="100px" height="100px">
          </div>
          <div class="card-title">
            <h4>Help & Support</h4>
          </div>
          <div class="card-feature-description">
            <span class>We are eager to get you on-board, talk to us.</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { storage, db } from "../services/Firebase";
import { helper } from "../services/Helper";
export default {
  data() {
    return {
      uploadError: null,
      videoSource: null,
      blank: true,
      progressUpload: 0,
      uploadTask: "",
      uploading: false,
      uploadEnd: false,
      payload: null,
      showCard: true
    };
  },
  methods: {
    reset() {
      // reset form to initial state
      this.isloading = false;
      this.uploadEnd = false;
      this.uploadError = null;
      this.videoSource = null;
      this.blank = true;
      this.payload = null;
      this.showCard = true;
    },
    resetError() {
      // reset form to initial state
      this.uploadError = null;
    },
    save() {
      // upload data to the server
      window.scrollTo(0, 0);
      try {
        this.uploading = true;
        this.uploadTask = storage
          .ref("awavideo/" + this.payload["name"])
          .put(this.payload);
      } catch {
        this.uploadError = true;
      }
    },
    cameraFilesChange(fieldName, fileList) {
      // handle file changes
      this.blank = false;
      this.showCard = false;
      if (!fileList.length) return;
      this.payload = fileList[0];
      this.videoSource = URL.createObjectURL(this.payload);
    },
    videoFilesChange(fieldName, fileList) {
      // handle file changes
      this.blank = false;
      this.showCard = false;
      if (!fileList.length) return;
      this.payload = fileList[0];
      this.videoSource = URL.createObjectURL(this.payload);
    },
    saveInit() {
      // save it
      this.save();
    }
  },
  watch: {
    uploadTask: function() {
      this.uploadTask.on(
        "state_changed",
        sp => {
          this.progressUpload = Math.floor(
            (sp.bytesTransferred / sp.totalBytes) * 100
          );
        },
        null,
        () => {
          this.uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            this.uploadEnd = true;
            this.uploading = false;
            this.videoSource = null;
            db.collection("awavideo").add({
              identifier: helper.generateIdentifier(),
              videoURL: downloadURL,
              created: new Date(),
              timestamp: new Date()
            });
            setTimeout(() => {
              this.reset();
            }, 3000);
          });
        }
      );
    }
  },
  mounted() {
    this.reset();
  }
};
</script>
