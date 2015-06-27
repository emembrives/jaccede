package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	jaccede "github.com/emembrives/jaccede/api"
	gocache "github.com/pmylund/go-cache"
)

type Empty struct{}

type PlaceInfo struct {
	Name       string
	Address    string
	Rating     float64
	Accessible bool
	JaccedeUid string
}

type jsonMap map[string]interface{}

var (
	diacriticsRemover = strings.NewReplacer("é", "e", "è", "e", "à", "a", "î", "i", "ô", "o", "ë", "e", "ï", "i", "ç", "c")

	// Create a cache with a default expiration time of 5 minutes, and which
	// purges expired items every 30 seconds
	cache = gocache.New(24*time.Hour, 30*time.Minute)
)

func main() {
	http.HandleFunc("/search/", searchPlace)
	http.HandleFunc("/testrequest", makeJaccedeRequest)
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func searchPlace(w http.ResponseWriter, r *http.Request) {
	placeName := r.FormValue("name")
	placeAddress := r.FormValue("address")
	latitudeStr := r.FormValue("latitude")
	longitudeStr := r.FormValue("longitude")

	info := PlaceInfo{Name: placeName, Address: placeAddress}

	if fullInfo, ok := cache.Get(fmt.Sprint(info)); ok {
		if err := json.NewEncoder(w).Encode(&fullInfo); err != nil {
			panic(err)
		}
	}

	found, uid := runJaccedeQuery(placeName, placeAddress, latitudeStr, longitudeStr)

	fullInfo := info
	fullInfo.Accessible = found
	fullInfo.JaccedeUid = uid

	cache.Set(fmt.Sprint(info), fullInfo, gocache.DefaultExpiration)

	if err := json.NewEncoder(w).Encode(&fullInfo); err != nil {
		panic(err)
	}
}

func runJaccedeQuery(name string, address string, latStr string, lngStr string) (bool, string) {
	client := jaccede.NewClient()
	request := jaccede.NewSearchRequest()
	request.SetSearchQuery(name, address, -1)
	if len(latStr) != 0 && len(lngStr) != 0 {
		lat, errLat := strconv.ParseFloat(latStr, 64)
		lng, errLng := strconv.ParseFloat(lngStr, 64)
		if errLat != nil || errLng != nil {
			log.Print(errLat)
			log.Print(errLng)
		} else {
			request.SetSearchLocation(lat, lng, 0.03)
		}
	}
	request.SetSearchParameters(0, 30)

	raw_response := client.SendRequest(request)
	search_response, err := raw_response.GetSearchResponse()
	if err != nil {
		log.Println(err)
		return false, ""
	}

	nameMap := getWordMap(name)

	for _, placeResult := range search_response.Results {
		nameResultMap := getWordMap(placeResult["name"].(string))
		overlap, _ := wordMapOverlap(nameMap, nameResultMap)
		if overlap >= 1 {
			return true, placeResult["uid"].(string)
		}
	}

	return false, ""
}

func wordMapOverlap(m1, m2 map[string]bool) (overlap, max int) {
	overlap = 0
	for w, _ := range m1 {
		if m2[w] {
			overlap++
		}
	}
	max = len(m1) + len(m2) - overlap
	return
}

func getWordMap(s string) map[string]bool {
	var l []string = strings.Split(diacriticsRemover.Replace(s), " ")
	var m map[string]bool = make(map[string]bool)
	for _, word := range l {
		m[word] = true
	}
	return m
}

func makeJaccedeRequest(w http.ResponseWriter, r *http.Request) {
	client := jaccede.NewClient()
	request := jaccede.NewSearchRequest()
	request.SetSearchQuery("", "", -1)
	request.SetSearchLocation(48.893603, 2.248431, 0.1)
	request.SetSearchParameters(0, 30)

	response := client.SendRequest(request)
	body, err := ioutil.ReadAll(response.Response.Body)
	if err != nil {
		panic(err)
	}
	fmt.Fprintf(w, "%s", body)
}
