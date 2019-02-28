<template>
  <section class="section">
    <div class="container">
      <div class="content-wrapper">
        <div v-if="videoCollections.length === 0 && hasData === 0" class="mb-20 has-text-centered">
          <img src="loading.svg" alt>
        </div>
        <div v-if="selectedVideos.length > 0 && !isDownloading" class="mb-20 animated fadeInUp">
          <button class="button is-link" v-on:click="downloadSelected">
            <i class="fa fa-download"></i> Download selected
          </button>
        </div>
        <div v-if="isDownloading" class="mb-20 animated fadeInUp">
          <a class="button is-link is-loading" disabled>Loading</a>
        </div>
        <div v-if="downloadError" class="notification is-danger animated slideInUp">
          <button class="delete"></button>
          Unable to download selected video(s). Please try again!
        </div>
         <div v-if="videoCollections.length === 0 && hasData === 2" class="notification is-danger animated slideInUp">
          No video found in your repository.
        </div>
        <div class="columns is-vcentered is-multiline">
          <!-- Card -->
          <div
            class="column is-one-third"
            v-for="(vc, i) in videoCollections"
            :key="`${i}-${vc.id}`"
          >
            <div class="flex-card light-bordered hover-raised">
              <header class="card-header">
                <div class="field">
                  <div class="b-checkbox is-accent">
                    <input
                      :id="vc.id"
                      class="styled"
                      type="checkbox"
                      v-on:click="selectVideo(vc.data.videoURL)"
                    >
                    <label :for="vc.id"></label>
                  </div>
                </div>
              </header>

              <div class="card-body">
                <div class="content is-vcentered">
                  <div>
                    <video
                      :src="vc.data.videoURL"
                      style="height: 200px !important; width: 100% !important"
                      id="player"
                      controls
                    ></video>
                  </div>
                  <div class="animated fadeIn mb-20">
                    <button
                      :disabled="isDownloadingSingle"
                      v-on:click="downloadSingle(vc)"
                      class="button is-info is-pulled-left"
                    >
                      <i class="fa fa-download"></i> Download
                    </button>
                    <!-- <a
                      v-if="buttonObject[vc.data.videoURL] && isDownloadingSingle"
                      class="button is-link is-loading animated slideInUp"
                      disabled
                    >Loading</a>-->
                    <button class="button is-danger is-pulled-right" v-on:click="deleteVideo(vc)">
                      <i class="fa fa-trash"></i> Delete
                    </button>
                  </div>
                </div>
              </div>
              <footer class="card-footer">
                <p class="card-footer-item">
                  <span>Created on {{ vc.data.timestamp.toDate() | date }}</span>
                </p>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { db } from "../../services/Firebase";
import Swal from "sweetalert2";
import { saveToZip } from "../../services/Zipper";

const dateFilter = value => {
  return new Date(value).toDateString();
};

export default {
  filters: {
    date: dateFilter
  },
  data() {
    return {
      hasData: 0,
      buttonObject: {},
      videoCollections: [],
      selectedVideos: [],
      isDownloading: false,
      isDownloadingSingle: false,
      downloadError: false,
      deleteError: {
        hasError: false,
        error: null
      }
    };
  },
  methods: {
    getVideos() {
      const self = this;
      const items = db.collection("awavideo").orderBy("timestamp", "desc");
      items.onSnapshot(videos => {
        self.videoCollections = [];
        self.hasData = 0;
        videos.forEach(video => {
          let _video = {
            id: "",
            data: {}
          };
          _video.id = video.id;
          _video.data = video.data();
          self.videoCollections.push(_video);
        });
        if (self.videoCollections.length === 0) {
          self.hasData = 2;
        } else {
          self.hasData = 1;
        }
      });
    },
    deleteVideo(video) {
      Swal.fire({
        title: "Delete Confirmation",
        text: "Are you sure you want to delete this video?",
        type: "warning",
        animation: false,
        customClass: "animated slideInDown",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(result => {
        if (result.value) {
          db.collection("awavideo")
            .doc(video["id"])
            .delete()
            .then(() => {
              Swal.fire(
                "Deleted!",
                "The video file has been deleted.",
                "success"
              );
              this.getVideos();
              this.deleteError = {
                hasError: false,
                error: null
              };
            })
            .catch(error => {
              Swal.fire(
                "Error!",
                "Unable to delete the video file. Please try again.",
                "error"
              );
              this.deleteError = {
                hasError: true,
                error
              };
            });
        }
      });
    },
    isSelected(video) {
      return this.selectedVideos.filter(_video => _video == video).length > 0;
    },
    selectVideo(video) {
      if (this.isSelected(video)) {
        this.selectedVideos = this.selectedVideos.filter(
          _video => _video !== video
        );
      } else {
        this.selectedVideos.push(video);
      }
    },
    downloadSelected() {
      if (this.selectedVideos.length > 0) {
        this.isDownloading = true;
        const now = new Date().getTime();
        saveToZip(`awavideo-${now}.zip`, this.selectedVideos)
          .then(() => {
            this.isDownloading = false;
          })
          .catch(() => {
            this.downloadError = true;
            this.isDownloading = false;
            setTimeout(() => {
              this.downloadError = false;
            }, 3000);
          });
      } else {
        Swal.fire(
          "Download Error",
          "Please select video for download!",
          "error"
        );
      }
    },
    downloadSingle(video) {
      this.buttonObject[video.data.videoURL] = video.data.videoURL;
      // this.$refs[video.id].disabled = "disabled";
      this.isDownloadingSingle = true;
      let videoForDownload = [];
      videoForDownload.push(video.data.videoURL);
      const now = new Date().getTime();
      saveToZip(`awavideo-${now}.zip`, videoForDownload)
        .then(() => {
          this.isDownloadingSingle = false;
          //this.$refs[video.id].disabled = "false";
          this.buttonObject = {};
        })
        .catch(() => {
          Swal.fire(
            "Download Error",
            "Unable to download selected video(s). Please try again!",
            "error"
          );
          // this.$refs[video.id].disabled = false;
          this.downloadError = true;
          this.isDownloadingSingle = false;
          this.buttonObject = {};
          setTimeout(() => {
            this.downloadError = false;
          }, 3000);
        });
    }
  },
  mounted() {
    this.hasData = 0;
    this.buttonObject = {};
    this.isDownloading = false;
    this.isDownloadingSingle = false;
    this.downloadError = false;
    this.selectedVideos = [];
    this.getVideos();
  }
};
</script>
<style>
.p-10 {
  padding: 10px;
}
</style>
